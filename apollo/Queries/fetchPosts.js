import gql from 'graphql-tag';
const fetchPosts = gql`
    {
        posts {
        text 
        title 
        id 
    }
    }
`;
export default fetchPosts;