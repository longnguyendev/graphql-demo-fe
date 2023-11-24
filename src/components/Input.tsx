import { Box, IconButton, InputBase, InputBaseProps } from "@mui/material";
import { ReactNode, forwardRef } from "react";

interface InputProps extends InputBaseProps {
  icon: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, onSubmit, ...props }, ref) => (
    <Box
      mt={1}
      mb={2}
      display="flex"
      alignItems="center"
      borderRadius={5}
      pl={2}
      sx={{
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
      }}
      component="form"
      onSubmit={onSubmit}
    >
      <InputBase
        ref={ref}
        fullWidth
        autoComplete="off"
        {...props}
        inputProps={{ maxLength: 1000 }}
      />
      <IconButton type="submit">{icon}</IconButton>
    </Box>
  )
);
