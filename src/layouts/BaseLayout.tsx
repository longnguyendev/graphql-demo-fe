import { Link, Outlet } from "react-router-dom";
import {
  Gender,
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
import { Profile, Users, UsersPlus } from "@/assets/icons";
import { DatePicker } from "@mui/x-date-pickers";

const FIRST = 20;

const genders = [
  { label: "Other", value: Gender.Other },
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female },
];

export function BaseLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModalProfile, setOpenModalProfile] = useState(false);
  const handleOpenModal = () => {
    setOpenModalProfile(true), handleClose();
  };
  const handleCloseModalProfile = () => setOpenModalProfile(false);

  const [openModalCreateNewGroup, setOpenModalCreateNewGroup] = useState(false);
  const handleOpenModalCreateNewGroup = () => {
    setOpenModalCreateNewGroup(true);
  };
  const handleCloseModalCreateNewGroup = () =>
    setOpenModalCreateNewGroup(false);

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
        open={openModalProfile}
        onClose={handleCloseModalProfile}
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
              defaultValue={userData?.me.name}
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
              defaultValue={userData?.me.dob}
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
              <Select
                label="Gender"
                fullWidth
                defaultValue={userData?.me.gender}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender.label} value={gender.label}>
                    {gender.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" sx={{ marginLeft: "auto" }}>
            Save
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openModalCreateNewGroup}
        onClose={handleCloseModalCreateNewGroup}
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
            width: 500,
            height: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontWeight="bolder"
          >
            Create New Group
          </Typography>

          <TextField
            label="Name"
            margin="normal"
            placeholder="Enter group name"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Search to add members"
            margin="normal"
            placeholder="Enter the name of the users you want to add"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Membbers"
            margin="normal"
            placeholder="Empty"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            sx={{ marginLeft: "auto", marginTop: "auto" }}
          >
            Create
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
          <IconButton>
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
            <Button
              onClick={handleOpenModalCreateNewGroup}
              startIcon={<UsersPlus />}
              sx={{
                color: "#727375",
                width: "100%",
                border: "1px solid #eee",
                bgcolor: "white",
                py: 2,
              }}
            >
              Add new group{" "}
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
