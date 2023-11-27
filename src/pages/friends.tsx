import { Box, Typography } from "@mui/material";
import { None } from "../assets/images/None.tsx";

export function FrendsPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
    >
      <None />
      <Typography variant="h5" component="h1">
        Select a conversation or start a new one
      </Typography>
    </Box>
  );
}
