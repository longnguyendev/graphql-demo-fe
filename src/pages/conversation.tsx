import { Box, Typography } from "@mui/material";
import { useInfinityScroll } from "@/hooks";
import {
  CreateMessageInput,
  useConversationQuery,
  useCreateMessageMutation,
  useMeQuery,
  useMessageCreatedSubscription,
  useMessagesQuery,
} from "@/gql/graphql";
import { useCallback } from "react";
import { SendOutlined } from "@mui/icons-material";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { MessageList, Input, LoadingSpinner } from "@/components";

const FIRST = 20;

const schema = yup
  .object({
    content: yup.string().required(),
  })
  .required();

type Schema = Omit<CreateMessageInput, "conversationId">;

export function ConversationPage() {
  const { conversationId: _conversationId } = useParams();

  const conversationId = Number(_conversationId);

  const navigate = useNavigate();

  const { data: conversationData } = useConversationQuery({
    variables: {
      conversationId,
    },
    onError: () => navigate("/", { replace: true }),
  });

  const { register, handleSubmit, reset } = useForm<Schema>({
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

  const [createMessage] = useCreateMessageMutation({
    onCompleted: () => reset(),
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

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      px={2}
      bgcolor="#F0F4FA"
    >
      <Typography textAlign="center" p={2} fontWeight="bold">
        {conversationData?.conversation.name}
      </Typography>
      <Box
        display="flex"
        flexDirection="column-reverse"
        flex={1}
        overflow="auto"
        rowGap={0.5}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <MessageList data={data} userId={userData?.me.id} />
        )}
        <Box ref={ref} />
      </Box>
      <Input
        onSubmit={handleSubmit(onSubmit)}
        icon={<SendOutlined />}
        {...register("content")}
      />
    </Box>
  );
}
