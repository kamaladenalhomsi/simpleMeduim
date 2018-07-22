import gql from 'graphql-tag';

const deletePost = gql`
  mutation($id: ID!, $imageName: String!) {
    deletePost(id: $id, imageName: $imageName) {
      status_code
    }
  }
`;

export default deletePost;