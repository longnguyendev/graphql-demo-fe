import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserData on User {
    id
    email
    name
    lastName
    firstName
    dob
    gender
    bio
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      ...UserData
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($first: Float, $after: String, $search: String) {
    users(first: $first, after: $after, search: $search) {
      nodes {
        ...UserData
      }
      totalCount
      nextCursor
    }
  }
`;

export const UP_DATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      ...UserData
    }
  }
`;

export const GET_USERS_NOT_ME = gql`
  query GetUsersNotMe($first: Float, $after: String, $search: String) {
    usersNotMe(first: $first, after: $after, search: $search) {
      nodes {
        ...UserData
      }
      totalCount
      nextCursor
    }
  }
`;
