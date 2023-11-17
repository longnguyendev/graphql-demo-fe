import { Box, Typography } from "@mui/material";

interface EmptyBoxProps {
  content?: string;
}

export function EmptyBox({ content = "No result found" }: EmptyBoxProps) {
  return (
    <Box
      flex={1}
      p={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography color="GrayText" fontStyle="italic">
        {content}
      </Typography>
    </Box>
  );
}
