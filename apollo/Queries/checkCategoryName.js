import gql from 'graphql-tag';

const checkCategoryNameExist = gql` 
  query($name: String!){
    checkCategoryNameExist(name: $name) {
      status_code
    }
  }
`;

export default checkCategoryNameExist;