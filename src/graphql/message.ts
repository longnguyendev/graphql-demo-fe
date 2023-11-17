import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageData on Message {
    id
    content
    sender {
      ...UserData
    }
    conversation {
      id
    }
    createdAt
  }
`;

export const MESSAGE_CREATED = gql`
  subscription MessageCreated($conversationId: Float) {
    messageCreated(conversationId: $conversationId) {
      ...MessageData
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages($first: Float, $after: String, $conversationId: Float!) {
    messages(first: $first, after: $after, conversationId: $conversationId) {
      nodes {
        ...MessageData
      }
      totalCount
      nextCursor
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageData
    }
  }
`;
