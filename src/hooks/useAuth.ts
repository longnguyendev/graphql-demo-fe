import { useCallback, useContext } from "react";
import { useLoginMutation, useSignUpMutation } from "@/gql/graphql";
import { AuthContext } from "@/components/AuthProvider";
import { ApolloError, useApolloClient } from "@apollo/client";

interface UseAuth {
  onError?: (error: ApolloError) => void;
}

export const useAuth = ({ onError }: UseAuth = {}) => {
  const { token, setToken } = useContext(AuthContext);

  const client = useApolloClient();

  const [login] = useLoginMutation({
    onCompleted: (data) => setToken(data.login.accessToken),
    onError,
  });

  const [signUp] = useSignUpMutation({
    onCompleted: (data) => setToken(data.signUp.accessToken),
    onError,
  });

  const logout = useCallback(() => {
    setToken("");
    client.clearStore();
  }, [client, setToken]);

  return {
    login,
    signUp,
    logout,
    isAuth: Boolean(token),
  };
};
