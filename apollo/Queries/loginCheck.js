import gql from 'graphql-tag';
const loginCheck = gql`
  query($email: String!, $password: String!) {
    loginCheck(email: $email, password: $password) {
      status_code
      token
      name
      username
      id
    }
  }
`;

export default loginCheck;