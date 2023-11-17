import { Box, CircularProgress } from "@mui/material";

export function LoadingSpinner() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
