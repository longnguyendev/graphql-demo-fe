import { ConversationDataFragment } from "@/gql/graphql";
import { EmptyBox } from ".";
import { ConversationListItem } from "./ConversationListItem";
import { List } from "@mui/material";

interface ConversationListProps {
  nodes: ConversationDataFragment[];
}

export function ConversationList({ nodes }: ConversationListProps) {
  if (nodes.length) {
    return (
      <List>
        {nodes.map((node) => (
          <ConversationListItem key={node.id} {...node} />
        ))}
      </List>
    );
  }

  return <EmptyBox content="No conversation" />;
}
