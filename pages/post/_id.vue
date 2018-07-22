<template lang="pug">
  div(id="SinglePost")
    h1(v-if="error404") Error 404 Post not Found!
    div(v-if="!error404") 
      div(class="container")
        div(class="custom-margin")
          MaterialBox
            div(class="container ninteen")
              div(class="singlePost")
                div(class="img_singlePost" v-if="postImage != null")
                  img(:src="'/uploads/images/'+postImage")
                div(class="row post-down-part") 
                  div(class="col s9")
                    h4(class="postTitle") {{ postTitle }}
                  div(class="col s3") 
                    span(class="post-Date") Created At: {{ createdAt }} hours ago
              p(class="post-text") {{ postText }}
              div(class="post-by") The Post By: 
                span
                  nuxt-link(:to="'/user/'+WritterId") {{ postWritter }} 
                
                
</template>
<script>
// Quereis 
import fetchSinglePost from '../../apollo/Queries/fetchSinglePost.js';
import checkId from '../../apollo/Queries/checkId.js';
// Components
import MaterialBox from '../../components/regularMaterialBox.vue';
// Moment 
import moment from 'moment';
export default {
  name: "SinglePost",
  components: {
    MaterialBox
  },
  async asyncData({ route, store, app }) {
    console.log(route.params.id);
    let client = app.apolloProvider.defaultClient;
    let idCheck = await client.query({
      query: checkId,
      variables: {
        id: route.params.id
      }
    });
    if(idCheck.data.idCheck.status_code === "Success") {
      let postData = await client.query({ 
        query: fetchSinglePost,
        variables: {
          id: route.params.id
        }
      }).catch((error) => console.log(error));
      store.commit('post/SET_POST', postData.data.post);
    } else {
      return {
        error404: true
      }
    }
  },
  data() {
    return {
      error404: false,
      postImage: this.$store.getters['post/GET_POST'].image,
      postTitle: this.$store.getters['post/GET_POST'].title,
      postText: this.$store.getters['post/GET_POST'].text,
      postCategory: this.$store.getters['post/GET_POST'].categoryName,
      postWritter: this.$store.getters['post/GET_POST'].author.name,
      WritterId: this.$store.getters['post/GET_POST'].author.id
    }
  },
  computed: {
    createdAt: function() {
      let dateNow = moment();
      let compareDate = moment(this.$store.getters['post/GET_POST'].createdAt);
      let days = dateNow.diff(compareDate, "hours"); 
      console.log(days);
      return days;
    }
  }
}
</script>
