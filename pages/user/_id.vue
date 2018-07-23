<template lang="pug">
  div(id="userPosts")
    h1(v-if="error404") Error 404 Post not Found!
    div(v-if="!error404") 
      div(class="container")
        div(class="custom-margin")
          h1(class="user-posts-heading") Posts By: 
            span {{ userName }}
          MaterialBox
            div(class="container ninteen")
              div(class="singlePost list-post" v-for="post in userPosts")
                div(class="img-list-post" v-if="post.image != null" v-bind:style="{ 'background-image': 'url(/uploads/images/' + post.image + ')' }")
                div(class="row post-down-part") 
                  div(class="col s9")
                    h4(class="postTitle")
                      nuxt-link(:to="'/post/'+post.id" class="post-title-link") {{ post.title }}
                  div(class="col s3") 
                    span(class="post-Date") Created At: {{ createdAt(post.createdAt) }} hours ago
                p(class="post-text") {{ post.text | textLimit }}
</template>
<script>
// Quereies
import fetchUserPosts from '../../apollo/Queries/fetchUserPosts.js';
import checkUserIdExsit from '../../apollo/Queries/checkUserIdExsit.js';
// Components
import MaterialBox from '../../components/regularMaterialBox.vue';
// Moment 
import moment from 'moment';
export default {
  name: "userPosts",
  middleware: 'auth',
  components: {
    MaterialBox
  },
  async asyncData({ route, store, app }) {
    let client = app.apolloProvider.defaultClient;
    let userCheck = await client.query({
      query: checkUserIdExsit,
      variables: {
        id: route.params.id
      }
    });
    if(userCheck.data.checkUserIdExsit.status_code === "Success") {
      let userPosts = await client.query({ 
        query: fetchUserPosts,
        variables: {
          id: route.params.id
        }
      }).catch((error) => console.log(error));
      return {
        userPosts: userPosts.data.user.posts,
        userName: userPosts.data.user.name
      }
    } else {
      return {
        error404: true
      }
    }
  },
  data() {
    return {
      error404: false
    }
  },
  methods: {
      createdAt: function(date) {
      let dateNow = moment();
      let compareDate = moment(date);
      let days = dateNow.diff(compareDate, "hours"); 
      return days;
    }
  }
}
</script>
