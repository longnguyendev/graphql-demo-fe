import { ConversationDataFragment } from "@/gql/graphql";
import { stringAvatar, truncate } from "@/utils";
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { Link, useMatch } from "react-router-dom";

type ConversationListItemProps = ConversationDataFragment;

export function ConversationListItem({
  id,
  name,
  lastMessage,
  createdAt,
}: ConversationListItemProps) {
  const match = useMatch(`/conversation/${id}`);

  return (
    <ListItem alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
      <ListItemButton
        component={Link}
        to={`/conversation/${id}`}
        sx={{
          py: 2,
          bgcolor: match ? "#5B96F7" : "white",
          borderRadius: 3,
          ":hover": { backgroundColor: "#adc8f7" },
        }}
      >
        <ListItemAvatar>
          <Avatar
            {...stringAvatar(name)}
            sx={{ width: "50px", height: "50px" }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between">
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: match ? "white" : "black",
                }}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  color: match ? "white" : "black",
                }}
              >
                {format(new Date(createdAt), "hh:mm")}
              </Typography>
            </Box>
          }
          secondary={
            lastMessage
              ? `${truncate(lastMessage.content, 20)}`
              : `Start a conversation`
          }
          secondaryTypographyProps={{ color: match ? "white" : "black" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
