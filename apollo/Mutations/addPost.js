import gql from 'graphql-tag';
const addPost = gql`
  mutation($title: String!, $text: String!, $image: String, $authorId: String!, $categoryName: String!) {
    addPost(title: $title, text: $text, image: $image, authorId: $authorId, categoryName: $categoryName ) {
      id
    }
  }
`;

export default addPost;