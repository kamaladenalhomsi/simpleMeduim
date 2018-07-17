import gql from 'graphql-tag';

const addUser = gql`
  mutation($name: String!, $username: String!, $email: String!, $password: String!){
    addUser(name: $name, username: $username, email: $email, password: $password){
      token
      name
      username
      email
      id
    }
  }
`;

export default addUser;