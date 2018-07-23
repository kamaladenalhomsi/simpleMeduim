<template lang="pug">
  section(class="container")
    div(class="custom-margin ")
      div(class="row")
        div(class="col s8")
          h1(class="page-heading") Categories
        div(class="col s4") 
          <div class="input-field">
            <i class="material-icons prefix">search</i>
            <input id="icon_prefix" type="text" class="validate" v-model="search" placeholder="search">
          </div>
    div(class="cats-outter")
      div(class="row")
        div(class="col s3" v-for="cats in filteredCategories")
          div(class="cats-box")
            nuxt-link(:to="'/category/'+cats.name") {{ cats.name }}
      
</template>
<script>
// Check from where user come from 
import fetchCategories from '../apollo/Queries/fetchCategories.js';
// Functions
import capitalizeFirstLetter from '../assets/functions/firstLetterUppercase.js';
export default {
  middleware: "auth",
  async asyncData({ app }) {
    let client = app.apolloProvider.defaultClient;
    let returnedCategories = await client.query({
      query: fetchCategories
    });
    return {
      categories: returnedCategories
    }    
  },
  components: {
  },
  mounted() {
    if(document.referrer === "http://localhost:3000/signIn") {
      history.pushState(null, null, location.href);
      window.onpopstate = function () {
          history.go(1);
      };
    }
    if(document.referrer === "http://localhost:3000/signUp") {
      history.pushState(null, null, location.href);
      window.onpopstate = function () {
          history.go(1);
      };
    } 
  },
  data(){
    return {
      search: ""
    }
  },
  computed: {
    filteredCategories: function() {
      let { categories } = this.categories.data;
      return categories.filter((cats) => {
        return cats.name.match(capitalizeFirstLetter(this.search));
      });
    }
  }
}

</script>

