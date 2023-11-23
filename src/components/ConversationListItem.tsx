import { ConversationDataFragment } from "@/gql/graphql";
import { stringToColor, truncate } from "@/utils";
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
            sx={{
              bgcolor: stringToColor(name),
              width: "50px",
              height: "50px",
            }}
          >
            {name[0]}
          </Avatar>
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
                  color: match ? "white" : "#999",
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
          secondaryTypographyProps={{ color: match ? "white" : "#999" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
