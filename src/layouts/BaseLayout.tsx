import { Link, Outlet } from "react-router-dom";
import {
  useConversationCreatedSubscription,
  useConversationsQuery,
  useMeQuery,
  useMessageCreatedSubscription,
} from "@/gql/graphql";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth, useInfinityScroll } from "@/hooks";
import { ConversationList, LoadingSpinner, SearchUser } from "@/components";
import logo from "@/assets/images/logo.png";
import { Messenger } from "@/assets/icons/Messenger";
import { useState } from "react";
import { stringAvatar } from "@/utils";
import { Profile } from "@/assets/icons";
import { DatePicker } from "@mui/x-date-pickers";

const FIRST = 20;

export function BaseLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true), handleClose();
  };
  const handleCloseModal = () => setOpenModal(false);

  const { logout } = useAuth();

  const { data: userData } = useMeQuery();

  const { data, updateQuery, loading, fetchMore } = useConversationsQuery();

  const fetchNextPage = () => {
    if (data?.conversations.nextCursor) {
      fetchMore({
        variables: {
          first: FIRST,
          after: data.conversations.nextCursor,
        },
      });
    }
  };

  const ref = useInfinityScroll(fetchNextPage);

  useMessageCreatedSubscription({
    onData: ({ data: { data } }) => {
      updateQuery((prev) => {
        if (!data?.messageCreated) return prev;

        const nodes = prev.conversations.nodes
          ?.map((node) =>
            node.id === data.messageCreated.conversation.id
              ? {
                  ...node,
                  lastMessage: data.messageCreated,
                  updatedAt: data.messageCreated.createdAt,
                }
              : node
          )
          .sort((a, b) => b.updatedAt - a.updatedAt);

        return {
          ...prev,
          conversations: { ...prev.conversations, nodes },
        };
      });
    },
  });

  useConversationCreatedSubscription({
    onData: ({ data: { data } }) => {
      updateQuery((prev) => {
        if (!data?.conversationCreated) return prev;

        const { conversationCreated } = data;

        return {
          ...prev,
          conversations: {
            ...prev.conversations,
            nodes: [
              conversationCreated,
              ...(prev.conversations.nodes ? prev.conversations.nodes : []),
            ],
            totalCount: prev.conversations.totalCount + 1,
          },
        };
      });
    },
  });

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            fontWeight="bolder"
          >
            Profile
          </Typography>
          <Avatar sx={{ margin: "auto", height: "120px", width: "120px" }} />
          <Box component="form">
            <TextField
              label="name"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              defaultValue="User Name"
            />
            <TextField
              label="Bio"
              multiline={true}
              rows={3}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              defaultValue="chưa cập nhật"
            />
            <DatePicker
              disableFuture
              label="Controlled picker"
              slotProps={{
                textField: {
                  InputLabelProps: {
                    shrink: true,
                  },

                  fullWidth: true,
                },
              }}
              sx={{ my: "15px" }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" fullWidth defaultValue="other">
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" sx={{ marginLeft: "auto" }}>
            Save
          </Button>
        </Box>
      </Modal>
      <Box display="flex">
        <Box
          p={2}
          borderRight={1}
          borderColor="rgba(0, 0, 0, 0.12)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <IconButton component={Link} to="/">
            <Box
              component="img"
              src={logo}
              width={75}
              height={75}
              alt="Chat lgbt"
            />
          </IconButton>
          <IconButton
            {...(data?.conversations.nodes?.[0]?.id && {
              component: Link,
              to: `/conversation/${data.conversations.nodes[0].id}`,
            })}
          >
            <Messenger />
          </IconButton>

          {userData && (
            <>
              <IconButton onClick={handleClick} sx={{ mt: "auto" }}>
                <Avatar {...stringAvatar(userData.me.name)}></Avatar>
              </IconButton>

              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  ".MuiMenu-list": {
                    background: "#F8FAFF",
                    width: "190px",
                    padding: 1,
                  },
                }}
              >
                <Typography
                  variant="inherit"
                  textAlign="center"
                  fontWeight="bolder"
                  mb={2}
                  px={2}
                  sx={{ userSelect: "none" }}
                >
                  {userData.me.lastName}
                </Typography>
                <MenuItem
                  onClick={handleOpenModal}
                  sx={{
                    bgcolor: "white",
                    my: 1,
                    border: "1px solid #eee",
                    borderRadius: 1.5,
                  }}
                >
                  <ListItemIcon>
                    <Profile />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  sx={{
                    color: "red",
                    bgcolor: "white",
                    my: 1,
                    border: "1px solid #eee",
                    borderRadius: 1.5,
                  }}
                >
                  <ListItemIcon>
                    <Logout sx={{ color: "red" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
        <Grid container>
          <Grid
            item
            xs={4}
            borderRight={1}
            borderColor="rgba(0, 0, 0, 0.12)"
            sx={{
              height: "100vh",
              overflowY: "auto",
              p: 2,
              bgcolor: "#F8FAFF",
            }}
          >
            <Typography variant="h4">Chats</Typography>
            <SearchUser />
            {loading ? <LoadingSpinner /> : <ConversationList data={data} />}
            <Box ref={ref} />
          </Grid>
          <Grid item xs={8}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
