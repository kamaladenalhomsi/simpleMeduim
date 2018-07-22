import gql from 'graphql-tag';


const fetchCategoriesPosts = gql`
  query($name: String!) {
    category(name: $name) {
      name
      posts {
        title 
        text 
        image 
        createdAt 
        id 
        categoryName
        author{
          name
          id
        }
      }
    }
  }
`;

export default fetchCategoriesPosts;