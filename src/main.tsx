import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";
import { AuthProvider, PrivateRoute, ToastProvider } from "./components";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  LoginPage,
  SignUpPage,
  HomePage,
  ConversationPage,
  NotFoundPage,
} from "./pages";
import { AuthLayout, BaseLayout } from "./layouts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="conversation/:conversationId"
            element={<ConversationPage />}
          />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <CssBaseline />
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
