import gql from 'graphql-tag';

const editPost = gql`
  mutation($id: ID!, $title: String!, $text: String!, $categoryName: String!, $oldImageName: String, $image: String){
    editPost(id: $id, title: $title, text: $text, categoryName: $categoryName, oldImageName: $oldImageName, image: $image) {
      status_code
    }
  }
`;

export default editPost;