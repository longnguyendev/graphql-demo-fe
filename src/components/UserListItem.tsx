import { UserDataFragment } from "@/gql/graphql";
import { stringAvatar } from "@/utils";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export interface UserListItemProps {
  option: UserDataFragment;
  onClick: (option: UserDataFragment) => void;
}

export function UserListItem({ option, onClick }: UserListItemProps) {
  return (
    <ListItemButton
      onClick={() => onClick(option)}
      sx={{ bgcolor: "#eee", borderRadius: 6, my: 1 }}
    >
      <ListItemAvatar>
        <Avatar {...stringAvatar(option.lastName)} />
      </ListItemAvatar>
      <ListItemText primary={option.name} />
    </ListItemButton>
  );
}
