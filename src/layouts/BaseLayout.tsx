import { Link, Outlet } from "react-router-dom";
import {
  Gender,
  MeDocument,
  MeQuery,
  MeQueryVariables,
  UpdateUserInput,
  useConversationCreatedSubscription,
  useConversationsQuery,
  useMeQuery,
  useMessageCreatedSubscription,
  useUpdateUserMutation,
} from "@/gql/graphql";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { endOfDay } from "date-fns";
import { options } from "@/pages";
import { useApolloClient } from "@apollo/client";

const FIRST = 20;

const schema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .min(2, "First name contains at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .nullable(),
    lastName: yup
      .string()
      .trim()

      .min(2, "Last name contains at least 2 characters")
      .max(20, "Last name must not exceed 20 characters")
      .nullable(),
    dob: yup
      .date()
      .max(endOfDay(new Date()), "Enter valid birthday")
      .nullable(),
    gender: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender), "Gender is required")
      .nullable(),
    bio: yup.string().max(200, "Bio must not exceed 200 characters").nullable(),
  })
  .required();

export function BaseLayout() {
  const client = useApolloClient();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UpdateUserInput>({
    resolver: yupResolver(schema),
    defaultValues: async () =>
      await client
        .query<MeQuery, MeQueryVariables>({
          query: MeDocument,
        })
        .then(({ data }) =>
          data?.me
            ? {
                firstName: data.me.firstName,
                lastName: data.me.lastName,
                dob: data.me.dob,
                bio: data.me.bio,
                gender: data.me.gender,
              }
            : {}
        ),
  });

  const [update] = useUpdateUserMutation();

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

  const onSubmit: SubmitHandler<UpdateUserInput> = (updateUserInput) =>
    update({ variables: { updateUserInput } });

  return (
    <>
      <Modal
        open={openModalProfile}
        onClose={handleCloseModalProfile}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
          <TextField
            margin="normal"
            autoComplete="given-name"
            required
            fullWidth
            label="First Name"
            autoFocus
            {...register("firstName")}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            InputLabelProps={{ shrink: true }}
            placeholder="Enter your first name"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            autoComplete="family-name"
            {...register("lastName")}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            InputLabelProps={{ shrink: true }}
            placeholder="Enter your last name"
          />

          <TextField
            margin="normal"
            label="Bio"
            multiline={true}
            rows={3}
            fullWidth
            autoComplete="family-name"
            {...register("bio")}
            error={Boolean(errors.bio)}
            helperText={errors.bio?.message}
            InputLabelProps={{ shrink: true }}
            placeholder="Enter your bio"
          />
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <DatePicker
                disableFuture
                label="Controlled picker"
                slotProps={{
                  textField: {
                    error: Boolean(errors.dob),
                    InputLabelProps: {
                      shrink: true,
                    },
                    helperText: errors.dob?.message?.toString(),
                    fullWidth: true,
                  },
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={Boolean(errors.gender)}>
                <InputLabel shrink>Gender</InputLabel>
                <Select label="Gender" fullWidth {...field}>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
            )}
          />
          <Button type="submit" variant="contained" sx={{ marginLeft: "auto" }}>
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
              Add new group
            </Button>
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
