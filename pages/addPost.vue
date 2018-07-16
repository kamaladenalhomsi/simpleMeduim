<template lang="pug">
  div(id="addPost")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") Add Post  
      div(class="form-outter")
        form()
          div(class="row")
            div(class="input-field col s6")
              input(id="first_name" type="text" class="validate" placeholder="Post Title")
          div(class="row")
            div(class="input-field col s6")
              textarea(class="materialize-textarea post-textarea" placeholder="Post Text")
          div(class="row")
            div(class="search-cats-list col s6")
              input(id="search" type="text" class="validate" placeholder="Search")
              ul 
                li(v-for="cats in categories.data.categories") {{ cats.name }}
</template>

<script>
// Check from where user come from 
import fetchCategories from '../apollo/Queries/fetchCategories.js';
  export default {
    name: "AddPost",
    middleware: 'auth',
    async asyncData({ app }) {
      let client = app.apolloProvider.defaultClient;
      let returnedCategories = await client.query({
        query: fetchCategories
      });
      console.log(returnedCategories);
      return {
        categories: returnedCategories
      }    
    },
  }
</script>
