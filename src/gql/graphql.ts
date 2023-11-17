import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Auth = {
  __typename?: 'Auth';
  accessToken: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  name: Scalars['String']['output'];
  participants: Array<User>;
  updatedAt: Scalars['Date']['output'];
};

export type ConversationEdge = {
  __typename?: 'ConversationEdge';
  cursor: Scalars['String']['output'];
  node: Conversation;
};

export type CreateConversationInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  participantIds: Array<Scalars['Float']['input']>;
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Float']['input'];
};

export type CreateUserInput = {
  dob: Scalars['Date']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  gender: Gender;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversation: Conversation;
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  sender: User;
  updatedAt: Scalars['Date']['output'];
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor: Scalars['String']['output'];
  node: Message;
};

export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  createMessage: Message;
  login: Auth;
  removeConversation: Conversation;
  removeMessage: Message;
  signUp: Auth;
};


export type MutationCreateConversationArgs = {
  createConversationInput: CreateConversationInput;
};


export type MutationCreateMessageArgs = {
  createMessageInput: CreateMessageInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRemoveConversationArgs = {
  id: Scalars['Float']['input'];
};


export type MutationRemoveMessageArgs = {
  id: Scalars['Float']['input'];
};


export type MutationSignUpArgs = {
  signUpInput: CreateUserInput;
};

export type PaginatedConversation = {
  __typename?: 'PaginatedConversation';
  edges?: Maybe<Array<ConversationEdge>>;
  nextCursor?: Maybe<Scalars['String']['output']>;
  nodes?: Maybe<Array<Conversation>>;
  totalCount: Scalars['Float']['output'];
};

export type PaginatedMessage = {
  __typename?: 'PaginatedMessage';
  edges?: Maybe<Array<MessageEdge>>;
  nextCursor?: Maybe<Scalars['String']['output']>;
  nodes?: Maybe<Array<Message>>;
  totalCount: Scalars['Float']['output'];
};

export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  edges?: Maybe<Array<UserEdge>>;
  nextCursor?: Maybe<Scalars['String']['output']>;
  nodes?: Maybe<Array<User>>;
  totalCount: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  conversation: Conversation;
  conversations: PaginatedConversation;
  me: User;
  message: Message;
  messages: PaginatedMessage;
  users: PaginatedUser;
};


export type QueryConversationArgs = {
  conversationId: Scalars['Float']['input'];
};


export type QueryConversationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMessageArgs = {
  id: Scalars['Float']['input'];
};


export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  conversationId: Scalars['Float']['input'];
  first?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  search?: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  conversationCreated: Conversation;
  messageCreated: Message;
};


export type SubscriptionMessageCreatedArgs = {
  conversationId?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date']['output'];
  dob: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: Gender;
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type AuthDataFragment = { __typename?: 'Auth', accessToken: string };

export type SignUpMutationVariables = Exact<{
  signUpInput: CreateUserInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'Auth', accessToken: string } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', accessToken: string } };

export type ConversationDataFragment = { __typename?: 'Conversation', id: number, name: string, createdAt: any, updatedAt: any, lastMessage?: { __typename?: 'Message', content: string, createdAt: any } | null };

export type ConversationCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ConversationCreatedSubscription = { __typename?: 'Subscription', conversationCreated: { __typename?: 'Conversation', id: number, name: string, createdAt: any, updatedAt: any, lastMessage?: { __typename?: 'Message', content: string, createdAt: any } | null } };

export type ConversationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Float']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type ConversationsQuery = { __typename?: 'Query', conversations: { __typename?: 'PaginatedConversation', totalCount: number, nextCursor?: string | null, nodes?: Array<{ __typename?: 'Conversation', id: number, name: string, createdAt: any, updatedAt: any, lastMessage?: { __typename?: 'Message', content: string, createdAt: any } | null }> | null } };

export type ConversationQueryVariables = Exact<{
  conversationId: Scalars['Float']['input'];
}>;


export type ConversationQuery = { __typename?: 'Query', conversation: { __typename?: 'Conversation', name: string } };

export type CreateConversationMutationVariables = Exact<{
  createConversationInput: CreateConversationInput;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation: { __typename?: 'Conversation', id: number, name: string, createdAt: any, updatedAt: any, lastMessage?: { __typename?: 'Message', content: string, createdAt: any } | null } };

export type MessageDataFragment = { __typename?: 'Message', id: number, content: string, createdAt: any, sender: { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender }, conversation: { __typename?: 'Conversation', id: number } };

export type MessageCreatedSubscriptionVariables = Exact<{
  conversationId?: InputMaybe<Scalars['Float']['input']>;
}>;


export type MessageCreatedSubscription = { __typename?: 'Subscription', messageCreated: { __typename?: 'Message', id: number, content: string, createdAt: any, sender: { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender }, conversation: { __typename?: 'Conversation', id: number } } };

export type MessagesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Float']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  conversationId: Scalars['Float']['input'];
}>;


export type MessagesQuery = { __typename?: 'Query', messages: { __typename?: 'PaginatedMessage', totalCount: number, nextCursor?: string | null, nodes?: Array<{ __typename?: 'Message', id: number, content: string, createdAt: any, sender: { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender }, conversation: { __typename?: 'Conversation', id: number } }> | null } };

export type CreateMessageMutationVariables = Exact<{
  createMessageInput: CreateMessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', id: number, content: string, createdAt: any, sender: { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender }, conversation: { __typename?: 'Conversation', id: number } } };

export type UserDataFragment = { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender } };

export type GetUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Float']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUser', totalCount: number, nextCursor?: string | null, nodes?: Array<{ __typename?: 'User', id: number, email: string, name: string, lastName: string, dob: any, gender: Gender }> | null } };

export const AuthDataFragmentDoc = gql`
    fragment AuthData on Auth {
  accessToken
}
    `;
export const ConversationDataFragmentDoc = gql`
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
export const UserDataFragmentDoc = gql`
    fragment UserData on User {
  id
  email
  name
  lastName
  dob
  gender
}
    `;
export const MessageDataFragmentDoc = gql`
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
    ${UserDataFragmentDoc}`;
export const SignUpDocument = gql`
    mutation SignUp($signUpInput: CreateUserInput!) {
  signUp(signUpInput: $signUpInput) {
    ...AuthData
  }
}
    ${AuthDataFragmentDoc}`;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      signUpInput: // value for 'signUpInput'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const LoginDocument = gql`
    mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    ...AuthData
  }
}
    ${AuthDataFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ConversationCreatedDocument = gql`
    subscription ConversationCreated {
  conversationCreated {
    ...ConversationData
  }
}
    ${ConversationDataFragmentDoc}`;

/**
 * __useConversationCreatedSubscription__
 *
 * To run a query within a React component, call `useConversationCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useConversationCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useConversationCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ConversationCreatedSubscription, ConversationCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ConversationCreatedSubscription, ConversationCreatedSubscriptionVariables>(ConversationCreatedDocument, options);
      }
export type ConversationCreatedSubscriptionHookResult = ReturnType<typeof useConversationCreatedSubscription>;
export type ConversationCreatedSubscriptionResult = Apollo.SubscriptionResult<ConversationCreatedSubscription>;
export const ConversationsDocument = gql`
    query Conversations($first: Float, $after: String) {
  conversations(first: $first, after: $after) {
    nodes {
      ...ConversationData
    }
    totalCount
    nextCursor
  }
}
    ${ConversationDataFragmentDoc}`;

/**
 * __useConversationsQuery__
 *
 * To run a query within a React component, call `useConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useConversationsQuery(baseOptions?: Apollo.QueryHookOptions<ConversationsQuery, ConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationsQuery, ConversationsQueryVariables>(ConversationsDocument, options);
      }
export function useConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationsQuery, ConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationsQuery, ConversationsQueryVariables>(ConversationsDocument, options);
        }
export type ConversationsQueryHookResult = ReturnType<typeof useConversationsQuery>;
export type ConversationsLazyQueryHookResult = ReturnType<typeof useConversationsLazyQuery>;
export type ConversationsQueryResult = Apollo.QueryResult<ConversationsQuery, ConversationsQueryVariables>;
export const ConversationDocument = gql`
    query Conversation($conversationId: Float!) {
  conversation(conversationId: $conversationId) {
    name
  }
}
    `;

/**
 * __useConversationQuery__
 *
 * To run a query within a React component, call `useConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useConversationQuery(baseOptions: Apollo.QueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
      }
export function useConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
        }
export type ConversationQueryHookResult = ReturnType<typeof useConversationQuery>;
export type ConversationLazyQueryHookResult = ReturnType<typeof useConversationLazyQuery>;
export type ConversationQueryResult = Apollo.QueryResult<ConversationQuery, ConversationQueryVariables>;
export const CreateConversationDocument = gql`
    mutation CreateConversation($createConversationInput: CreateConversationInput!) {
  createConversation(createConversationInput: $createConversationInput) {
    ...ConversationData
  }
}
    ${ConversationDataFragmentDoc}`;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      createConversationInput: // value for 'createConversationInput'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const MessageCreatedDocument = gql`
    subscription MessageCreated($conversationId: Float) {
  messageCreated(conversationId: $conversationId) {
    ...MessageData
  }
}
    ${MessageDataFragmentDoc}`;

/**
 * __useMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageCreatedSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useMessageCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(MessageCreatedDocument, options);
      }
export type MessageCreatedSubscriptionHookResult = ReturnType<typeof useMessageCreatedSubscription>;
export type MessageCreatedSubscriptionResult = Apollo.SubscriptionResult<MessageCreatedSubscription>;
export const MessagesDocument = gql`
    query Messages($first: Float, $after: String, $conversationId: Float!) {
  messages(first: $first, after: $after, conversationId: $conversationId) {
    nodes {
      ...MessageData
    }
    totalCount
    nextCursor
  }
}
    ${MessageDataFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($createMessageInput: CreateMessageInput!) {
  createMessage(createMessageInput: $createMessageInput) {
    ...MessageData
  }
}
    ${MessageDataFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      createMessageInput: // value for 'createMessageInput'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($first: Float, $after: String, $search: String) {
  users(first: $first, after: $after, search: $search) {
    nodes {
      ...UserData
    }
    totalCount
    nextCursor
  }
}
    ${UserDataFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;