import gql from 'graphql-tag';

const checkId = gql`
  query($id: String!) {
    idCheck(id: $id) {
      status_code
    }
  }
`;

export default checkId;