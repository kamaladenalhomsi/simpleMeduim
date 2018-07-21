import gql from 'graphql-tag';
const fetchPosts = gql`
    {
        posts {
            id
            title 
            text 
            createdAt 
            image
            categoryName
            author{
                name
            }
          }
    }
`;
export default fetchPosts;