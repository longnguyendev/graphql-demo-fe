import { UsersPlus } from "@/assets/icons";
import { ConversationList, LoadingSpinner, SearchUser } from "@/components";
import { CreateNewGroup } from "@/components/CreateNewGroup";
import { useConversationsQuery } from "@/gql/graphql";
import { useInfinityScroll } from "@/hooks";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const FIRST = 20;

export function ConversationLayout() {
  const { data, fetchMore, loading } = useConversationsQuery();

  const [openCreateNewGroup, setOpenCreateNewGroup] = useState(false);

  const handleOpenCreateNewGroup = () => {
    setOpenCreateNewGroup(true);
  };
  const handleCloseCreateNewGroup = () => {
    setOpenCreateNewGroup(false);
  };

  const fetchNextPage = () => {
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
        {loading ? <LoadingSpinner /> : <ConversationList data={data} />}
        <Box ref={ref} />
      </Grid>
      <Grid item xs={8}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
