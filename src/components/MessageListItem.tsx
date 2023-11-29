import { Avatar, Box, Tooltip } from "@mui/material";
import { MessageDataFragment } from "@/gql/graphql";
import { motion } from "framer-motion";
import { formatDate, stringToColor } from "@/utils";

interface MessageProps extends MessageDataFragment {
  isSender: boolean;
}

export function MessageListItem({
  createdAt,
  content,
  isSender,
  sender,
}: MessageProps) {
  return (
    <Box
      component={motion.div}
      display="flex"
      flexDirection={isSender ? "row-reverse" : "row"}
      alignItems="flex-start"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
    >
      <Avatar
        sx={{
          bgcolor: stringToColor(sender.lastName),
          width: "30px",
          height: "30px",
          mx: 2,
        }}
      >
        {sender.lastName[0]}
      </Avatar>
      <Tooltip
        title={formatDate(createdAt)}
        placement={isSender ? "left-start" : "right-start"}
      >
        <Box
          maxWidth="60%"
          py={1}
          px={2}
          sx={{
            // borderColor: "black",
            // borderWidth: 1,
            // borderStyle: "solid",
            color: isSender ? "white" : "black",
            bgcolor: isSender ? "#5B96F7" : "white",
            wordWrap: "break-word",
          }}
          // initial={{ y: 20, opacity: 0 }}
          // whileInView={{ y: 0, opacity: 1 }}
          // viewport={{ once: true }}
          borderRadius={3}
          {...(isSender
            ? {
                ml: "auto",
              }
            : {
                mr: "auto",
              })}
        >
          {content}
        </Box>
      </Tooltip>
    </Box>
  );
}
