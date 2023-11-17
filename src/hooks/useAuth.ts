import { useCallback, useContext } from "react";
import { useLoginMutation, useSignUpMutation } from "@/gql/graphql";
import { AuthContext } from "@/components/AuthProvider";
import { useApolloClient } from "@apollo/client";

export const useAuth = () => {
  const { token, setToken } = useContext(AuthContext);

  const client = useApolloClient();

  const [login] = useLoginMutation({
    onCompleted: (data) => setToken(data.login.accessToken),
  });

  const [signUp] = useSignUpMutation({
    onCompleted: (data) => setToken(data.signUp.accessToken),
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
