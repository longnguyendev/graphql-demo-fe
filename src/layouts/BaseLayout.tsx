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
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "@/hooks";
import logo from "@/assets/images/logo.png";
import { Messenger } from "@/assets/icons/Messenger";
import { useState } from "react";
import { stringAvatar } from "@/utils";
import { Profile, Users } from "@/assets/icons";
import { ProfileModal } from "@/components/ProfileModal";

import "../index.css";

export function BaseLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openProfile, setOpenProfile] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenProfile(true);
  };

  const { logout } = useAuth();

  const { data: userData } = useMeQuery();

  const { data, updateQuery } = useConversationsQuery();

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
      <Box display="flex" width="100vw">
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
            {...(data?.conversations.nodes?.[0]?.id
              ? {
                  component: Link,
                  to: `/conversation/${data.conversations.nodes[0].id}`,
                }
              : {
                  component: Link,
                  to: `/`,
                })}
          >
            <Messenger />
          </IconButton>
          <IconButton component={Link} to="/friends">
            <Users />
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
                  onClick={() => {
                    handleClose();
                  }}
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
        <Outlet />
      </Box>
      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />
    </>
  );
}
