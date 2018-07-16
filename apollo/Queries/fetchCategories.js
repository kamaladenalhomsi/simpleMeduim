import gql from 'graphql-tag';
const fetchCategories = gql`
    {
        categories {
        name
        id 
      }
    }
`;
export default fetchCategories;