import { GetUsersQuery } from "@/gql/graphql";
import { EmptyBox } from ".";
import { SearchUserListItem } from "./SearchUserListItem";
import { List } from "@mui/material";

interface SearchUserListProps {
  data?: GetUsersQuery;
  onClick: (id: number) => void;
}

export function SearchUserList({ data, onClick }: SearchUserListProps) {
  if (data?.users.nodes?.length) {
    const length = data.users.nodes.length;
    return (
      <List>
        {data.users.nodes.map((node, index) => (
          <SearchUserListItem
            key={node.id}
            onClick={onClick}
            {...node}
            divider={length - 1 !== index}
          />
        ))}
      </List>
    );
  }
  return <EmptyBox />;
}
