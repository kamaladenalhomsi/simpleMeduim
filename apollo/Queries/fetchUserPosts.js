import gql from 'graphql-tag';

const fetchUserPosts = gql`
  query($id: ID!) {
    user(id: $id) {
      name
      posts {
        title 
        text 
        image 
        createdAt 
        id 
        categoryName
      }
    }
  }
`;

export default fetchUserPosts;