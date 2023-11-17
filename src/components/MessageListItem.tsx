import { Box, Tooltip } from "@mui/material";
import { MessageDataFragment } from "@/gql/graphql";
import { motion } from "framer-motion";
import { formatDate } from "@/utils";

interface MessageProps extends MessageDataFragment {
  isSender: boolean;
}

export function MessageListItem({
  createdAt,
  content,
  isSender,
}: MessageProps) {
  return (
    <Tooltip
      title={formatDate(createdAt)}
      placement={isSender ? "left" : "right"}
    >
      <Box
        component={motion.div}
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
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
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
  );
}
