import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useInfinityScroll, useToast } from "@/hooks";
import {
  CreateMessageInput,
  useConversationQuery,
  useConversationsQuery,
  useCreateMessageMutation,
  useMeQuery,
  useMessageCreatedSubscription,
  useMessagesQuery,
  useUpdateConversationMutation,
} from "@/gql/graphql";
import { useCallback, useState } from "react";
import * as yup from "yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { MessageList, LoadingSpinner } from "@/components";
import { Send } from "@/assets/icons/Send";
import { MoreVert, SentimentSatisfiedAlt } from "@mui/icons-material";

import { EmojiPickerButton } from "@/components/EmojiPickerButton";

const FIRST = 20;

const schema = yup
  .object({
    content: yup.string().required(),
  })
  .required();

type Schema = Omit<CreateMessageInput, "conversationId">;

export function ConversationPage() {
  const toast = useToast();
  const { conversationId: _conversationId } = useParams();

  const conversationId = Number(_conversationId);

  const navigate = useNavigate();

  const { updateQuery: updateConversationsQuery } = useConversationsQuery();

  const { data: conversationData } = useConversationQuery({
    variables: {
      conversationId,
    },
    onError: () => navigate("/", { replace: true }),
  });

  const methods = useForm<Schema>({
    resolver: yupResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  const { data: userData } = useMeQuery();

  const { data, fetchMore, updateQuery, loading } = useMessagesQuery({
    variables: {
      conversationId,
      first: FIRST,
    },
  });

  const fetchNextPage = useCallback(() => {
    if (data?.messages.nextCursor) {
      fetchMore({
        variables: {
          conversationId,
          first: FIRST,
          after: data.messages.nextCursor,
        },
      });
    }
  }, [conversationId, data?.messages.nextCursor, fetchMore]);

  const ref = useInfinityScroll(fetchNextPage);

  const [updateConverSation] = useUpdateConversationMutation();

  const exitConverSation = () => {
    if (conversationData) {
      const participantIds = conversationData?.conversation.participants
        .filter((participant) => userData?.me.id !== participant.id)
        .map((participant) => participant.id);

      updateConverSation({
        variables: {
          updateConversationInput: {
            id: conversationData.conversation.id,
            name: conversationData.conversation.name,
            participantIds,
          },
        },
        onCompleted: () => {
          updateConversationsQuery((prev) => {
            const nodes = prev.conversations.nodes?.filter(
              (node) => node.id !== conversationId
            );

            return {
              ...prev,
              conversations: {
                ...prev.conversations,
                nodes,
                totalCount: prev.conversations.totalCount - 1,
              },
            };
          });
          navigate("/", { replace: true });
        },
      });
    }
  };

  const [createMessage] = useCreateMessageMutation({
    onCompleted: () => methods.reset(),
    onError: ({ message }) => {
      toast({
        status: "error",
        message: message,
      });
    },
  });

  const onSubmit: SubmitHandler<Schema> = (createMessageInput) => {
    const content = createMessageInput.content.trim();

    if (content) {
      createMessage({
        variables: {
          createMessageInput: {
            content,
            conversationId,
          },
        },
      });
    }
  };

  useMessageCreatedSubscription({
    variables: { conversationId },
    onData: ({ data: { data } }) => {
      updateQuery((prev) => {
        if (!data?.messageCreated) return prev;

        const { messageCreated } = data;

        return {
          ...prev,
          messages: {
            ...prev.messages,
            nodes: [
              messageCreated,
              ...(prev.messages.nodes ? prev.messages.nodes : []),
            ],
            totalCount: prev.messages.totalCount + 1,
          },
        };
      });
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <FormProvider {...methods}>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="#F0F4FA"
      >
        <Stack
          p={1}
          bgcolor="white"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography textAlign="center" p={2} fontWeight="bold">
            {conversationData?.conversation.name}
          </Typography>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVert />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                exitConverSation();
              }}
            >
              Rời Nhóm
            </MenuItem>
          </Menu>
        </Stack>

        <Box
          display="flex"
          flexDirection="column-reverse"
          flex={1}
          overflow="auto"
          rowGap={0.5}
          px={2}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <MessageList data={data} userId={userData?.me.id} />
          )}
          <Box ref={ref} />
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box
          width="100%"
          component="form"
          display="flex"
          p={2.5}
          bgcolor="#F7F9FD"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <InputBase
            fullWidth
            placeholder="Write a message"
            autoComplete="off"
            inputProps={{ maxLength: 1000 }}
            {...methods.register("content")}
            sx={{ bgcolor: "#EAF2FE", borderRadius: 3, px: 4, py: 1 }}
          />
          {/* call emoji component */}
          <EmojiPickerButton>
            <IconButton sx={{ width: "50px", height: "50px", ml: 2 }}>
              <SentimentSatisfiedAlt />
            </IconButton>
          </EmojiPickerButton>
          <Button
            type="submit"
            variant="contained"
            sx={{ ml: 3, borderRadius: 1.5, minWidth: "unset", px: 1.5 }}
          >
            <Send />
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
