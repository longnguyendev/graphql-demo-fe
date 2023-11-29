import {
  CreateConversationInput,
  GetUsersNotMeQueryVariables,
  UserDataFragment,
  useCreateConversationMutation,
  useGetUsersNotMeLazyQuery,
} from "@/gql/graphql";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";

import { useState } from "react";
import { stringAvatar } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks";

interface CreateNewGroupProps {
  open: boolean;
  onClose: () => void;
}

type CreateNewGroup = Omit<CreateConversationInput, "participantIds">;

export const CreateNewGroup = ({ open, onClose }: CreateNewGroupProps) => {
  const [fetchUsers, { data }] = useGetUsersNotMeLazyQuery();
  const [createConversation] = useCreateConversationMutation();

  const [selectedOptions, setSelectedOptions] = useState<
    readonly UserDataFragment[]
  >([]);

  const { register, handleSubmit, reset } =
    useForm<GetUsersNotMeQueryVariables>();

  const schema = yup.object({
    name: yup
      .string()
      .max(50, "group name must not exceed 50 characters")
      .nullable(),
  });

  const {
    register: createRegister,
    handleSubmit: handleCreate,
    reset: resetCreateGroup,
    formState: { errors },
  } = useForm<CreateNewGroup>({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<GetUsersNotMeQueryVariables> = ({ search }) => {
    fetchUsers({
      variables: {
        search,
      },
    });
  };

  const onCreate: SubmitHandler<CreateNewGroup> = ({ name }) => {
    if (selectedOptions.length > 1) {
      createConversation({
        variables: {
          createConversationInput: {
            name,
            participantIds: selectedOptions.map(
              (selectedOption) => selectedOption.id
            ),
          },
        },
        onCompleted: () => {
          onClose();
          setSelectedOptions([]);
          reset();
          resetCreateGroup();
        },
      });
      toast({ status: "success", message: "success" });
      return;
    }
    toast({
      status: "warning",
      message: "Choose more 2 another to create new group",
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <Box
          id="create-group-form"
          component="form"
          onSubmit={handleCreate(onCreate)}
          position="relative"
        >
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            placeholder="Enter group name"
            {...createRegister("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          position="relative"
        >
          <Autocomplete
            multiple
            id="tags-outlined"
            options={data?.usersNotMe.nodes ?? []}
            getOptionLabel={(option) => option.name}
            value={selectedOptions}
            filterSelectedOptions
            sx={{ "& > ul": { bgcolor: "red" } }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  m: 1,
                  bgcolor: "#eee",
                  borderRadius: 4,
                  "& > .MuiAvatar-root": { mr: 2, flexShrink: 0 },
                }}
                {...props}
              >
                <Avatar {...stringAvatar(option.lastName)} />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search to add members"
                margin="normal"
                placeholder="Enter the name of the users you want to add"
                {...register("search")}
              />
            )}
            onChange={(_, options) => setSelectedOptions(options)}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ marginLeft: "auto", marginTop: "auto" }}
          type="submit"
          form="create-group-form"
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};
