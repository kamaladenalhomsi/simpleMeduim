import gql from 'graphql-tag';

const checkUserIdExsit = gql`
  query($id: String!) {
    checkUserIdExsit(id: $id) {
      status_code
    }
  }
`;

export default checkUserIdExsit;