import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { CreateUserInput, Gender } from "@/gql/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks";
import { Link as RouterLink } from "react-router-dom";

interface CreateUserInputValidate extends CreateUserInput {
  rePassword: string;
}

const options = [
  {
    label: "Other",
    value: Gender.Other,
  },
  {
    label: "Male",
    value: Gender.Male,
  },
  {
    label: "Female",
    value: Gender.Female,
  },
];

const defaultValues: CreateUserInputValidate = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  rePassword: "",
  dob: new Date(),
  gender: Gender.Other,
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("This field must be a Email")
      .required("Email is required"),
    firstName: yup
      .string()
      .min(4, "less 50 char")
      .max(50, "ahihihi")
      .required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    password: yup.string().required("Password is required"),
    dob: yup.date().required("DOB is required"),
    rePassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Re-password is required"),
    gender: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender), "Gender is required")
      .required(),
  })
  .required();

export function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserInputValidate>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { signUp } = useAuth();

  const onSubmit: SubmitHandler<CreateUserInputValidate> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rePassword,
    ...signUpInput
  }) => signUp({ variables: { signUpInput } });
  return (
    <>
      <Typography component="h1" variant="h5" textAlign="center" mb={4}>
        Sign Up
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your email"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your password"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Repeat Password"
              type="password"
              autoComplete="new-password"
              {...register("rePassword")}
              error={Boolean(errors.rePassword)}
              helperText={errors.rePassword?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Re-enter your password"
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="dob"
              control={control}
              render={({ field: { value, ...rest } }) => (
                <DatePicker
                  disableFuture
                  label="Controlled picker"
                  defaultValue={value}
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
                  {...rest}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="gender"
              control={control}
              render={({ field: { value, ...rest } }) => (
                <FormControl fullWidth required error={Boolean(errors.gender)}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    fullWidth
                    defaultValue={value}
                    {...rest}
                  >
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
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Typography component="span">Already have an account? </Typography>
        <Link component={RouterLink} to="/login" variant="body2">
          Login now
        </Link>
      </Box>
    </>
  );
}
