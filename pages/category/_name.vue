<template lang="pug">
  div(id="categoryPosts")
    h1(v-if="error404") Error 404 Post not Found!
    div(v-if="!error404") 
      div(class="container")
        div(class="custom-margin")
          h1(class="user-posts-heading") Posts From: 
            span {{ categoryName }}
          MaterialBox
            div(class="container ninteen")
              div(v-if="!categoryPosts[0]" class="noPosts")
                h3 No Posts yet
                nuxt-link(to="/addPost") Be the first now that puplish
              div(v-else class="singlePost list-post" v-for="post in categoryPosts")
                div(class="img-list-post" v-if="post.image != null" v-bind:style="{ 'background-image': 'url(/uploads/images/' + post.image + ')' }")
                div(class="row post-down-part") 
                  div(class="col s9")
                    h4(class="postTitle")
                      nuxt-link(:to="'/post/'+post.id" class="post-title-link") {{ post.title }}
                  div(class="col s3") 
                    span(class="post-Date") Created At: {{ createdAt(post.createdAt) }} hours ago
                    span(class="post-author") Post By:
                      nuxt-link(:to="'/user/'+post.author.id") {{ post.author.name }}
                p(class="post-text") {{ post.text | textLimit }}
</template>
<script>
// Queries
import checkCategoryNameExist from '../../apollo/Queries/checkCategoryName.js';
import fetchCategoriesPosts from '../../apollo/Queries/fetchCategoriesPosts.js';
// Components
import MaterialBox from '../../components/regularMaterialBox.vue';
// Moment 
import moment from 'moment';
export default {
  name: "categoryposts",
  middleware: 'auth',
  components: {
    MaterialBox
  },
  async asyncData({ route, store, app }) {
    let client = app.apolloProvider.defaultClient;
    let categoryCheck = await client.query({
      query: checkCategoryNameExist,
      variables: {
        name: route.params.name
      }
    });
    if(categoryCheck.data.checkCategoryNameExist.status_code === "Success") {
        let categoryPosts = await client.query({ 
        query: fetchCategoriesPosts,
        variables: {
          name: route.params.name
        },
        fetchPolicy: 'network-only'
      }).catch((error) => console.log(error));
        return {
          categoryPosts: categoryPosts.data.category.posts,
          categoryName: categoryPosts.data.category.name
        }
    } else {
      return {
        error404: true
      }
    }
  },
  data() {
    return {
      error404: false,
      emptyCat: false
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
