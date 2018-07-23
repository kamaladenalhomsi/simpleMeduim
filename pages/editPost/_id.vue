<template lang="pug">
  div(id="addPost")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") Edit Post  
      div(class="form-outter")
        form(enctype="multipart/form-data" id="formData")
          div(class="row")
            div(class="input-field col s6")
              input(type="text" class="validate" placeholder="Post Title" v-validate="'required'" name="postTitle" v-model="postTitle")
              span(class="validation-error") {{ errors.first('postTitle') }}
          div(class="row")
            div(class="input-field col s6")
              textarea(class="materialize-textarea post-textarea" placeholder="Post Text" v-validate="'required'" name="postText" v-model="postText")
              span(class="validation-error") {{ errors.first('postText') }}
          div(class="row")
            div(class="search-cats-list col s6")
              input(type="search" class="validate" placeholder="Category (Search for autocomplete)" v-model="category" v-validate="'required'" name="postCategory")
              span(class="validation-error") {{ errors.first('postCategory') }}
              ul 
                li(v-for="cats in filteredCategories(limit)" @click="catSetValue") {{ cats.name }}
                li(@click="showMore" v-if="showMoreState") +{{ filteredCategories().length }} More
          div(class="row")
            div(class="file-field input-field col s6")
              div(class="btn")
                span Main Image 
                input(type="file" @change="setFilePath" id="image" name="postImage")
              div(class="file-path-wrapper")
                input(class="file-path" type="text" v-model="imageName")
            div(class="col s6")
              div(class="image-preview")
                img(:src="'/uploads/images/'+imageName" v-if="instantImagePreview.length == 0")
                img(:src="instantImagePreview" v-if="instantImagePreview.length > 0")
          div(class="row")
            button(type="submit" class="btn" @click.prevent="submitForm") Update
      SuccessMessage(:message="successMessage" v-if="successMessageOn")                  
</template>
<script>
// Quereis 
import fetchSinglePost from '../../apollo/Queries/fetchSinglePost.js';
import fetchCategories from '../../apollo/Queries/fetchCategories.js';
import fetchPosts from '../../apollo/Queries/fetchPosts.js';
// Mutations 
import editPost from '../../apollo/Mutations/editPost.js';
// Functions
import capitalizeFirstLetter from '../../assets/functions/firstLetterUppercase.js';
import fetchLimit from '../../assets/functions/fetchLimit.js';
// Axios
import axios from 'axios';
//Components 
import SuccessMessage from '../../components/successMessage.vue';
export default {
  name: "editPost",
  middleware: 'auth',
  async asyncData({ route, store, app }) {
    let client = app.apolloProvider.defaultClient;
    let returnedCategories = await client.query({
      query: fetchCategories
    });
    let postData = await client.query({
      query: fetchSinglePost,
      variables: {
        id: route.params.id
      }
    }).catch((error) => console.log(error));
    store.commit('post/SET_POST', postData.data.post);
    return {
      categories: returnedCategories,
    }  
  },
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    SuccessMessage
  },
  data() {
    return {
        category: this.$store.getters['post/GET_POST'].categoryName,
        limit: 5,
        showMoreState: true,
        imageName: this.$store.getters['post/GET_POST'].image,
        postTitle: this.$store.getters['post/GET_POST'].title,
        postText: this.$store.getters['post/GET_POST'].text,
        instantImagePreview: "",
        oldImageName: this.$store.getters['post/GET_POST'].image,
        successMessage: "",
        successMessageOn: false,
    }
  },
  methods: {
    catSetValue(li) {
      this.category = li.target.innerText;
    },
    filteredCategories: function(limit) {
      let { categories } = this.categories.data;
      let limitedArray = fetchLimit(categories, limit);
      return limitedArray.filter((cats) => {
        return cats.name.match(capitalizeFirstLetter(this.category));
      });
    },
    showMore: function() {
      this.showMoreState = false;
      this.limit = this.categories.data.categories.length;
    },
    setFilePath: function (event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
          // create a new FileReader to read this image and convert to base64 format
          var reader = new FileReader();
          // Define a callback function to run, when FileReader finishes its job
          reader.onload = (e) => {
              // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
              // Read image as base64 and set to imageData
              this.instantImagePreview = e.target.result;
          }
          // Start the reader job - read file as a data url (base64 format)
          reader.readAsDataURL(input.files[0]);
      }
      this.imageName = event.target.files[0].name;
    },
    async submitForm() {
      const isValid = await this.$validator.validateAll();
      let self = this;
      if(!isValid) return;
      if(isValid) {
        let image = document.getElementById("image");
        if(image.value !== "") {
          let client = self.$apolloProvider.defaultClient; 
          var formData = new FormData();
          let image = document.getElementById('image');
          formData.append("image", image.files[0]);
          const res = await axios.post('http://localhost:3000/postEdit', formData , {
          headers: {
          'Content-Type': 'multipart/form-data'
          }
          });
          self.imageName = await res.data;
          let updatePost = await client.mutate({
            mutation: editPost,
            variables: {
              id: self.$route.params.id,
              title: self.postTitle,
              text: self.postText,
              image: self.imageName,
              categoryName: self.category,
              oldImageName: self.oldImageName
            },
            refetchQueries: [{ query: fetchSinglePost }, { query: fetchPosts }]
          });
          self.oldImageName = self.imageName;
          self.successMessage = "Updates havd done successfully";
          self.successMessageOn = true;
          setTimeout(() => {
            self.successMessageOn = false;
          }, 3000);  
        } else {
          let client = self.$apolloProvider.defaultClient; 
          let updatePost = await client.mutate({
            mutation: editPost,
            variables: {
              id: self.$route.params.id,
              title: self.postTitle,
              text: self.postText,
              image: self.imageName,
              categoryName: self.category,
            },
            refetchQueries: [{ query: fetchSinglePost }, { query: fetchPosts }]
          });
          self.oldImageName = self.imageName;
          self.successMessage = "Updates havd done successfully";
          self.successMessageOn = true;
          setTimeout(() => {
            self.successMessageOn = false;
          }, 3000);  
        }
      }
    }
  }
}
</script>