import { gql } from "@apollo/client";

export const Auth_FRAGMENT = gql`
  fragment AuthData on Auth {
    accessToken
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($signUpInput: CreateUserInput!) {
    signUp(signUpInput: $signUpInput) {
      ...AuthData
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      ...AuthData
    }
  }
`;
