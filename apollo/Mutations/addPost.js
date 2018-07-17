import gql from 'graphql-tag';
const addPost = gql`
  mutation($title: String!, $text: String!, $createdAt: String!, $image: String!, $authorId: String!, $categoryName: String!) {
    addPost(title: $title, text: $text, createdAt: $createdAt, image: $image, authorId: $authorId, categoryName: $categoryName ) {
      title
    }
  }
`;

export default addPost;