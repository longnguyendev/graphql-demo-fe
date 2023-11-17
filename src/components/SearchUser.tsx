import { Box } from "@mui/material";
import { Input, LoadingSpinner, SearchUserList } from ".";
import {
  GetUsersQueryVariables,
  useCreateConversationMutation,
  useGetUsersLazyQuery,
} from "@/gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search } from "@mui/icons-material";
import { useState } from "react";

const FIRST = 20;

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

  const [getUser, { data, updateQuery, loading }] = useGetUsersLazyQuery();

  const [createConversation] = useCreateConversationMutation();

  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<GetUsersQueryVariables> = ({ search }) =>
    getUser({
      variables: {
        first: FIRST,
        search,
      },
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

  return (
    <Box>
      <Input
        onSubmit={handleSubmit(onSubmit)}
        icon={<Search />}
        {...register("search")}
        onFocus={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
      />
      {open &&
        (loading ? (
          <LoadingSpinner />
        ) : (
          <SearchUserList data={data} onClick={onClick} />
        ))}
    </Box>
  );
}
