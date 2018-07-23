<template lang="pug">
  div(id="userPosts")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") My Posts
        div(class="custom-margin")
          MaterialBox(class="material-box-userPosts" v-if="!noPosts")
            div(class="post-box" v-for="(post, index) in this.$store.getters['posts/GET_POSTS']")
              div(class="row inner-box-userPosts") 
                div(class="col s7")
                  h5(class="post-title-userPosts") {{ post.title }}
                  h6(class="createdAt-userPosts") {{ post.createdAt }}
                div(class="col s5")
                  div(class="control-buttons")
                    nuxt-link(:to="'/post/'+post.id" class="waves-effect waves-light btn view-post-button") View
                      i(class="material-icons right") visibility 
                    nuxt-link(:to="'/editPost/'+post.id" class="waves-effect waves-light btn edit-post-btn") Edit
                      i(class="material-icons right") edit 
                    button(type="button" class="waves-effect waves-light btn delete-post-btn" @click="deletePost(post.image, post.id, index)") Delete
                      i(class="material-icons right") delete 
          div(v-if="noPosts" class="noPosts")
            h3 No Posts yet
            nuxt-link(to="/addPost") Make Your First Post
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
// Quereis 
import fetchPosts from '../apollo/Queries/fetchPosts.js';
// Mutations 
import deletePost from '../apollo/Mutations/deletePost.js';
export default {
  name: "userPosts",
  middleware: 'auth',
  async asyncData({ app, store }) {
    let client = app.apolloProvider.defaultClient;
    let returnedPosts = await client.query({
      query: fetchPosts,
      fetchPolicy: 'network-only'
    });
    store.commit('posts/SET_POSTS', JSON.parse(JSON.stringify(returnedPosts.data.posts)));
  },
  components: {
    MaterialBox
  },
  data() {
    return {
      noPosts: false
    }
  },
  mounted() {
    if(this.$store.getters['posts/GET_POSTS'].length === 0) {
      this.noPosts = true;
    }
  },
  methods: {
    async deletePost(imageName, id, index) {
      let checkConfirmation = confirm("Are you sure you want delete this post ?");
      if(checkConfirmation) {
        // Define Apollo Client Server
        let client = this.$apolloProvider.defaultClient; 
        let deletedPost = await client.mutate({
          mutation: deletePost,
          variables: {
            id: id,
            imageName: imageName
          },
          refetchQueries: [{ query: fetchPosts }],
        }).catch((error) => console.log(error));
        this.$store.commit('posts/DELETE_POST', index);
        if(this.$store.getters['posts/GET_POSTS'].length === 0) {
          this.noPosts = true;
        }
      }
    }
  }
}
</script> 
