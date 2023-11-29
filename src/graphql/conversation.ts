import { gql } from "@apollo/client";

export const CONVERSATION_FRAGMENT = gql`
  fragment ConversationData on Conversation {
    id
    name
    participants {
      id
    }
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
      id
      name
      participants {
        id
      }
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

export const UPDATE_CONVERSATION_MUTATION = gql`
  mutation UpdateConversation(
    $updateConversationInput: UpdateConversationInput!
  ) {
    updateConversation(updateConversationInput: $updateConversationInput) {
      ...ConversationData
    }
  }
`;
