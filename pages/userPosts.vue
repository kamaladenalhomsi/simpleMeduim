<template lang="pug">
  div(id="userPosts")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") My Posts
        div(class="custom-margin")
          MaterialBox(class="material-box-userPosts")
            div(class="post-box" v-for="post in this.$store.getters['posts/GET_POSTS']")
              div(class="row inner-box-userPosts") 
                div(class="col s8")
                  h5(class="post-title-userPosts") {{ post.title }}
                  h6(class="createdAt-userPosts") {{ post.createdAt }}
                div(class="col s4")
                  div(class="control-buttons")
                    nuxt-link(:to="'/editPost/'+post.id" class="waves-effect waves-light btn edit-post-btn") Edit
                      i(class="material-icons right") edit 
                    button(type="button" class="waves-effect waves-light btn delete-post-btn") Delete
                      i(class="material-icons right") delete 
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
// Quereis 
import fetchPosts from '../apollo/Queries/fetchPosts.js';
export default {
  name: "userPosts",
  async asyncData({ app, store }) {
    let client = app.apolloProvider.defaultClient;
    let returnedPosts = await client.query({
      query: fetchPosts
    });
    store.commit('posts/SET_POSTS', returnedPosts.data.posts);
  },
  components: {
    MaterialBox
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script> 
