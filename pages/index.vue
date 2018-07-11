<template lang="pug">
  section(class="container")
    div
     h1(class="title") Meduim
      ul
       li(v-for="post in templateData.data.posts" :key="post.id") {{ post.title }}
</template>
<script>
import fetchPosts from '../apollo/Queries/fetchPosts.js';
export default {
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
  data(){
    return {
    }
  }
}
</script>

