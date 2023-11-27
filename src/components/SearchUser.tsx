import { Box, Paper } from "@mui/material";
import { Input, LoadingSpinner, SearchUserList } from ".";
import {
  GetUsersQueryVariables,
  useCreateConversationMutation,
  useGetUsersQuery,
} from "@/gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useInfinityScroll } from "@/hooks";
import { Search } from "@/assets/icons/Search";

const FIRST = 2;

const defaultValues = {
  search: "",
};

const schema = yup
  .object({
    search: yup.string().nullable(),
  })
  .required();

export function SearchUser() {
  const { register, handleSubmit } = useForm<GetUsersQueryVariables>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { data, refetch, updateQuery, fetchMore, loading } = useGetUsersQuery({
    variables: {
      first: FIRST,
    },
  });

  const fetchNextPage = useCallback(() => {
    if (data?.users.nextCursor) {
      fetchMore({
        variables: {
          first: FIRST,
          after: data.users.nextCursor,
        },
      });
    }
  }, [data?.users.nextCursor, fetchMore]);

  const listRef = useInfinityScroll(fetchNextPage);

  const [createConversation] = useCreateConversationMutation();

  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<GetUsersQueryVariables> = ({ search }) =>
    refetch({
      first: FIRST,
      search,
    });

  const onClick = (id: number) =>
    createConversation({
      variables: {
        createConversationInput: {
          participantIds: [id],
        },
      },
      onCompleted: () =>
        updateQuery((prev) => {
          const nodes = prev.users.nodes?.filter((node) => node.id !== id);

          return {
            ...prev,
            users: {
              ...prev.users,
              nodes,
              totalCount: prev.users.totalCount - 1,
            },
          };
        }),
    });

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <Box position="relative" ref={ref}>
      <Input
        onSubmit={handleSubmit(onSubmit)}
        icon={<Search />}
        {...register("search")}
        placeholder="Search"
        onFocus={() => {
          setOpen(true);
        }}
      />
      <Paper
        sx={{
          p: 1,
          position: "absolute",
          zIndex: 1,
          left: 0,
          right: 0,
          top: open ? 50 : 40,
          visibility: open ? "visible" : "hidden",
          opacity: open ? 1 : 0,
          transition: "all 0.s linear",
          maxHeight: 300,
          overflowX: "auto",
        }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <SearchUserList data={data} onClick={onClick} />
        )}
        <Box ref={listRef} />
      </Paper>
    </Box>
  );
}
