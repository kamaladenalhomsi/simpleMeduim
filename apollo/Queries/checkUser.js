import gql from 'graphql-tag';
const checkUser = gql`
  query($username: String!, $email: String!){
    checkUser(username: $username, email: $email) {
      status_code
    }
  }
`;

export default checkUser;