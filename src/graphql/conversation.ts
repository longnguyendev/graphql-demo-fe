import { gql } from "@apollo/client";

export const CONVERSATION_FRAGMENT = gql`
  fragment ConversationData on Conversation {
    id
    name
    createdAt
    updatedAt
    lastMessage {
      content
      createdAt
    }
  }
`;

export const CONVERSATION_CREATED = gql`
  subscription ConversationCreated {
    conversationCreated {
      ...ConversationData
    }
  }
`;

export const GET_CONVERSATIONS = gql`
  query Conversations($first: Float, $after: String) {
    conversations(first: $first, after: $after) {
      nodes {
        ...ConversationData
      }
      totalCount
      nextCursor
    }
  }
`;

export const GET_CONVERSATION = gql`
  query Conversation($conversationId: Float!) {
    conversation(conversationId: $conversationId) {
      name
    }
  }
`;

export const CREATE_CONVERSATION_MUTATION = gql`
  mutation CreateConversation(
    $createConversationInput: CreateConversationInput!
  ) {
    createConversation(createConversationInput: $createConversationInput) {
      ...ConversationData
    }
  }
`;
