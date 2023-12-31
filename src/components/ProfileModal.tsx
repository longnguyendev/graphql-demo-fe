import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/hooks";
import { options } from "@/pages";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Gender,
  UpdateUserInput,
  useMeLazyQuery,
  useUpdateUserMutation,
} from "@/gql/graphql";
import { endOfDay, subYears } from "date-fns";
import * as yup from "yup";

export const regex = /^[\p{L}\s]+$/u;

const schema = yup
  .object({
    firstName: yup
      .string()
      .matches(regex, "Enter valid first name")
      .trim()
      .min(2, "First name contains at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .nullable(),
    lastName: yup
      .string()
      .matches(regex, "Enter valid last name")
      .trim()
      .min(2, "Last name contains at least 2 characters")
      .max(20, "Last name must not exceed 20 characters")
      .nullable(),
    dob: yup
      .date()
      .min(subYears(new Date(), 200), "Enter valid dob")
      .max(endOfDay(new Date()), "Enter valid birthday")
      .nullable(),
    gender: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender), "Gender is required")
      .nullable(),
    bio: yup.string().max(200, "Bio must not exceed 200 characters").nullable(),
  })
  .required();

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [fetchMe, { updateQuery }] = useMeLazyQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UpdateUserInput>({
    resolver: yupResolver(schema),
    defaultValues: () =>
      fetchMe().then(({ data }) =>
        data?.me
          ? {
              firstName: data.me.firstName,
              lastName: data.me.lastName,
              dob: new Date(data.me.dob),
              bio: data.me.bio,
              gender: data.me.gender,
            }
          : {}
      ),
  });

  const toast = useToast();

  const [update] = useUpdateUserMutation({
    onCompleted: (data) => {
      updateQuery(() => ({
        me: data.updateUser,
      }));
      toast({ status: "success", message: "Success" });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<UpdateUserInput> = (updateUserInput) => {
    updateUserInput.firstName = updateUserInput.firstName?.trim();
    updateUserInput.lastName = updateUserInput.lastName?.trim();
    if (updateUserInput.bio) {
      updateUserInput.bio = updateUserInput.bio?.trim();
    } else {
      delete updateUserInput.bio;
    }
    console.log(updateUserInput);
    update({ variables: { updateUserInput } });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          inputProps={{ maxLength: 200 }}
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
              sx={{ my: 2 }}
              disableFuture
              label="Dob"
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
            <FormControl
              sx={{ my: 1 }}
              fullWidth
              required
              error={Boolean(errors.gender)}
            >
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
        <Button
          type="submit"
          variant="contained"
          sx={{ marginLeft: "auto", mt: 4 }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
}
