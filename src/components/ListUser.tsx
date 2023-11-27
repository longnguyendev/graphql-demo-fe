import { UserDataFragment } from "@/gql/graphql";
import { UserListItem } from "./UserListItem";
import { Box } from "@mui/material";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export interface ListUserProps {
  options: UserDataFragment[];
  selectedOptions: UserDataFragment[];
  onClick: (option: UserDataFragment) => void;
  onClose: () => void;
  open: boolean;
}

export default function ListUser({
  options,
  selectedOptions,
  onClick,
  onClose,
  open,
}: ListUserProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <Box
      ref={ref}
      position="absolute"
      height="220px"
      maxHeight="220px"
      overflow="auto"
      left={0}
      right={0}
      bgcolor="#F8FAFF"
      zIndex={99}
      p={1}
      borderRadius={3}
      visibility={open ? "visible" : "hidden"}
    >
      {options
        .filter(
          (option) =>
            !selectedOptions.some(
              (selectedOption) => selectedOption.id === option.id
            )
        )
        .map((option) => (
          <UserListItem key={option.id} option={option} onClick={onClick} />
        ))}
    </Box>
  );
}
