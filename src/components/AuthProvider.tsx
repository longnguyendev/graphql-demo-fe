import { PropsWithChildren, createContext } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useLocalStorage, useToast } from "@/hooks";
import { Kind, OperationTypeNode } from "graphql";
import { merge } from "@/utils";

const UNAUTHORIZED = 401;

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        messages: {
          keyArgs: ["conversationId"],
          merge,
        },
        users: {
          keyArgs: ["search"],
          merge,
        },
        conversations: {
          keyArgs: false,
          merge,
        },
      },
    },
  },
});

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

interface AuthContextProps {
  token: string;
  setToken: (value: string | ((val: string) => string)) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: "",
  setToken: () => null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useLocalStorage("token", "");

  const toast = useToast();

  const authorization = token ? `Bearer ${token}` : "";

  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:3001/graphql",
      connectionParams: {
        headers: {
          authorization,
        },
      },
    })
  );

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ extensions }) => {
        if (
          (extensions?.originalError as { statusCode?: number })?.statusCode ===
          UNAUTHORIZED
        ) {
          toast({ message: "Unauthorized", status: "error" });
          setToken("");
        }
      });
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization,
    },
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const client = new ApolloClient({
    cache,
    link: errorLink.concat(splitLink),
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}
