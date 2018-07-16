<template lang="pug">
  section(class="container")
    div
     h1(class="title") Meduim
      ul
       li(v-for="post in templateData.data.posts" :key="post.id") {{ post.title }}
</template>
<script>
// Check from where user come from 
import fetchPosts from '../apollo/Queries/fetchPosts.js';
export default {
  middleware: "auth",
  async asyncData({ app }) {
    let client = app.apolloProvider.defaultClient;
    let returnedData = await client.query({
      query: fetchPosts
    });
    return {
      templateData: returnedData
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
    }
  },
}

</script>

