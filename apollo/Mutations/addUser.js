import gql from 'graphql-tag';

const addUser = gql`
  mutation($name: String!, $username: String!, $email: String!, $password: String!){
    addUser(name: $name, username: $username, email: $email, password: $password){
      name 
      email
      password
    }
  }
`;

export default addUser;