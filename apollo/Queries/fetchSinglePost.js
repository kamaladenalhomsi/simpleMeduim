import gql from 'graphql-tag';

const fetchSinglePost = gql`
    query($id: ID!){
      post(id: $id) {
        id 
        title 
        text 
        author{
          name 
        }
        categoryName 
        createdAt
        image
      }
    }`;

export default fetchSinglePost;