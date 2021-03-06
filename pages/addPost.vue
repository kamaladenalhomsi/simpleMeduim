<template lang="pug">
  div(id="addPost")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") Add Post  
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
                li(v-for="cats in filteredCategories" @click="catSetValue") {{ cats.name }}
          div(class="row")
            div(class="file-field input-field col s6")
              div(class="btn")
                span Main Image 
                input(type="file" @change="setFilePath" id="image" name="postImage")
              div(class="file-path-wrapper")
                input(class="file-path" type="text" v-model="filePath")
            div(class="col s6")
              div(class="image-preview" v-if="instantImagePreview.length > 0")
                img(:src="instantImagePreview")
          div(class="row")
            div(class="col s4")
              button(type="submit" class="btn" @click.prevent="submitForm") Create
            div(class="col s8")
      SuccessMessage(:message="successMessage" v-if="successMessageOn")  
</template>

<script>
// Check from where user come from 
import fetchCategories from '../apollo/Queries/fetchCategories.js';
// Functions
import capitalizeFirstLetter from '../assets/functions/firstLetterUppercase.js';
import fetchLimit from '../assets/functions/fetchLimit.js';
// Mutations
import addPost from '../apollo/Mutations/addPost.js';
// Queries 
import fetchPosts from '../apollo/Queries/fetchPosts.js';
import fetchCategoriesPosts from '../apollo/Queries/fetchCategoriesPosts.js';
import fetchUserPosts from '../apollo/Queries/fetchUserPosts.js';
// Axios
import axios from 'axios';
// Components 
import SuccessMessage from '../components/successMessage.vue';
  export default {
    name: "AddPost",
    middleware: 'auth',
    components: {
      SuccessMessage
    },
    async asyncData({ app }) {
      let client = app.apolloProvider.defaultClient;
      let returnedCategories = await client.query({
        query: fetchCategories
      });
      return {
        categories: JSON.parse(JSON.stringify(returnedCategories.data.categories))
      }    
    },
    $_veeValidate: {
      validator: 'new'
    },
    data(){
      return {
        catLength: null,
        category: "",
        limit: 5,
        showMoreState: true,
        filePath: "",
        postTitle: "",
        postText: "",
        imageName: "",
        instantImagePreview: "",
        successMessage: "",
        successMessageOn: false,
      }
    },
    watch: {
      catLength(to, from) {
        if(to < 5 && to !== null) { 
          this.showMoreState = false;
        }
      }
    },
    methods: {
      catSetValue(li) {
        this.category = li.target.innerText;
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
        this.filePath = event.target.files[0].name;
      },
      async submitForm () {
        const isValid = await this.$validator.validateAll();
        let self = this;
        let post = null;
        if(!isValid) return;
        // Validation 
        let image = document.getElementById("image");
        if(image.value !== "") {
          var formData = new FormData();
          let image = document.getElementById('image');
          formData.append("image", image.files[0]);
          const res = await axios.post('http://localhost:3000/postAdd', formData, {
          headers: {
          'Content-Type': 'multipart/form-data'
          }
          });
          self.imageName = await res.data;
          // Define Apollo Client Server
          let client = self.$apolloProvider.defaultClient; 
          // Save the post to the database
          post =  await client.mutate({
            mutation: addPost,
            variables: {
              title: self.postTitle,
              text: self.postText,
              authorId: self.$store.getters['user/GET_ID'],
              categoryName: self.category,
              image: self.imageName
            },
            refetchQueries: [{ query: fetchPosts }, { query: fetchCategoriesPosts } ],
          });   
            // Success Message 
            this.successMessage = "The Post has been created successfully!";
            this.successMessageOn = true;
            setTimeout(() => {
              self.successMessageOn = false;
            }, 3000);  
            this.$router.push(`/post/${post.data.addPost.id}`);
        } else {
          let client = self.$apolloProvider.defaultClient; 
          // Save the post to the database
          post =  await client.mutate({
            mutation: addPost,
            variables: {
              title: self.postTitle,
              text: self.postText,
              authorId: self.$store.getters['user/GET_ID'],
              categoryName: self.category,
            },
            refetchQueries: [{ query: fetchPosts }, { query: fetchCategoriesPosts, variables: {name: self.category} } ],
          });                                
            // Success Message 
            this.successMessage = "The Post has been created successfully!";
            this.successMessageOn = true;
            setTimeout(() => {
              self.successMessageOn = false;
            }, 3000);  
            this.$router.push(`/post/${post.data.addPost.id}`);
        }
      }
    },
    computed: {
      filteredCategories: function() {
        return this.categories.filter((cats) => {
          return cats.name.match(capitalizeFirstLetter(this.category));
        });
      }
    }
  }
</script>
