import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { LoginInput } from "@/gql/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth, useToast } from "@/hooks";
import { Link as RouteLink } from "react-router-dom";

const schema = yup
  .object({
    email: yup
      .string()
      .email("This field must be a Email")
      .required("Email is required")
      .min(6, "less 6 chacracter")
      .max(50, "mot more than 255 character"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "password more than 6 charater")
      .max(50, "not more than 50 chacracter"),
  })
  .required();

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(schema),
  });

  const { login } = useAuth();

  const toast = useToast();

  const onSubmit: SubmitHandler<LoginInput> = (loginInput) => {
    login({
      variables: { loginInput },
      onError: () =>
        toast({ message: "Email or password is not correct", status: "error" }),
    });
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          autoComplete="email"
          autoFocus
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          InputLabelProps={{ shrink: true }}
          placeholder="Enter your email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          InputLabelProps={{ shrink: true }}
          placeholder="Enter your password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Typography component="span"> Don't have an account? </Typography>
        <Link component={RouteLink} to="/sign-up" variant="body2">
          Register now
        </Link>
      </Box>
    </>
  );
}
