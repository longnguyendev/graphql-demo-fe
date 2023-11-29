import { ConversationList, LoadingSpinner, SearchUser } from "@/components";

import { useConversationsQuery } from "@/gql/graphql";
import { useInfinityScroll } from "@/hooks";
import { Box, Grid, Typography } from "@mui/material";

import { Outlet } from "react-router-dom";

const FIRST = 20;

export function FriendsLayout() {
  const { data, fetchMore, loading } = useConversationsQuery();

  const fetchNextPage = () => {
    data?.conversations.nodes?.filter((node) => node.participants.length === 2);
    if (data?.conversations.nextCursor) {
      fetchMore({
        variables: {
          first: FIRST,
          after: data.conversations.nextCursor,
        },
      });
    }
  };

  const ref = useInfinityScroll(fetchNextPage);

  return (
    <Grid container width="calc(100vw - 124px)">
      <Grid
        item
        xs={4}
        borderRight={1}
        borderColor="rgba(0, 0, 0, 0.12)"
        sx={{
          height: "100vh",
          overflowY: "auto",
          p: 2,
          bgcolor: "#F8FAFF",
        }}
      >
        <Typography variant="h4">Chats</Typography>
        <SearchUser />
        <Typography py={2}>All friend chats</Typography>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ConversationList
            nodes={
              data?.conversations.nodes?.filter(
                (node) => node.participants.length === 2
              ) ?? []
            }
          />
        )}
        <Box ref={ref} />
      </Grid>
      <Grid item xs={8}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
