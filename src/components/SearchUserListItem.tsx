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
}

export function SearchUserListItem({
  id,
  name,
  onClick,
}: SearchUserListItemProps) {
  return (
    <ListItem
      divider
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
