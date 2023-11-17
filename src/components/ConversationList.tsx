import { ConversationsQuery } from "@/gql/graphql";
import { EmptyBox } from ".";
import { ConversationListItem } from "./ConversationListItem";
import { List } from "@mui/material";

interface ConversationListProps {
  data?: ConversationsQuery;
}

export function ConversationList({ data }: ConversationListProps) {
  if (data?.conversations.nodes?.length) {
    return (
      <List>
        {data.conversations.nodes.map((node) => (
          <ConversationListItem key={node.id} {...node} />
        ))}
      </List>
    );
  }

  return <EmptyBox content="No conversation" />;
}
