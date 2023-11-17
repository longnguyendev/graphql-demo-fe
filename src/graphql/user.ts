import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserData on User {
    id
    email
    name
    lastName
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
