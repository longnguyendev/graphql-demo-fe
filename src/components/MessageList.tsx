import { MessagesQuery } from "@/gql/graphql";
import { EmptyBox, MessageListItem } from ".";

interface MessageListProps {
  data?: MessagesQuery;
  userId?: number;
}
export function MessageList({ data, userId }: MessageListProps) {
  if (data?.messages.nodes?.length) {
    return data.messages.nodes.map((node) => (
      <MessageListItem
        key={node.id}
        isSender={userId === node.sender.id}
        {...node}
      />
    ));
  }

  return <EmptyBox content="No message" />;
}
