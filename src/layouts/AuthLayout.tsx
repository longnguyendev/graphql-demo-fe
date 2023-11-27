import { Box, Grid, Paper } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";
import logo from "@/assets/images/logo.png";
import "../index.css";

export function AuthLayout() {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        sm={false}
        md={6}
        sx={{
          backgroundImage: "url(images/welcome.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item sm={12} md={6}>
        <Box
          sx={{
            py: 8,
            px: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#F8FAFF",
            height: "100vh",
          }}
        >
          <Box component="img" src={logo} width={100} mb={3} />
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
