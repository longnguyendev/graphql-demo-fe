import { Box, Button, Grid, Typography } from "@mui/material";
import { None } from "../assets/images/None.tsx";
import { SearchUser } from "@/components/SearchUser.tsx";
import { UsersPlus } from "@/assets/icons/UsersPlus.tsx";
import { CreateNewGroup } from "@/components/CreateNewGroup.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { ConversationList } from "@/components/ConversationList.tsx";
import { useInfinityScroll } from "@/hooks/useInfinityScroll.ts";
import { useConversationsQuery } from "@/gql/graphql.ts";
import { useState } from "react";

const FIRST = 20;

export function FrendsPage() {
  const { data, fetchMore, loading } = useConversationsQuery();

  const [openCreateNewGroup, setOpenCreateNewGroup] = useState(false);

  const handleOpenCreateNewGroup = () => {
    setOpenCreateNewGroup(true);
  };
  const handleCloseCreateNewGroup = () => {
    setOpenCreateNewGroup(false);
  };

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
    <Grid
      container
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      gap={1}
    >
      <Grid
        item
        xs={6}
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
        <Button
          onClick={handleOpenCreateNewGroup}
          startIcon={<UsersPlus />}
          sx={{
            color: "#727375",
            width: "100%",
            border: "1px solid #eee",
            bgcolor: "white",
            py: 2,
          }}
        >
          Add new group
        </Button>
        <CreateNewGroup
          open={openCreateNewGroup}
          onClose={handleCloseCreateNewGroup}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ConversationList nodes={data?.conversations.nodes ?? []} />
        )}
        <Box ref={ref} />
      </Grid>
      <Grid xs={6}>
        <None />
        <Typography variant="h5" component="h1">
          Select a conversation or start a new one
        </Typography>
      </Grid>
    </Grid>
  );
}
