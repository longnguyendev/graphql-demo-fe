import { UserDataFragment } from "@/gql/graphql";
import { stringAvatar } from "@/utils";
import { Add } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

interface SearchUserListItemProps extends UserDataFragment {
  onClick: (id: number) => void;
  divider?: boolean;
}

export function SearchUserListItem({
  id,
  name,
  onClick,
  divider,
}: SearchUserListItemProps) {
  return (
    <ListItem
      divider={divider}
      secondaryAction={
        <IconButton edge="end" onClick={() => onClick(id)}>
          <Add />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar {...stringAvatar(name)} />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  );
}
