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
                li(v-for="cats in filteredCategories(limit)" @click="catSetValue") {{ cats.name }}
                li(@click="showMore" v-if="showMoreState") +{{ filteredCategories().length }} More
          div(class="row")
            div(class="file-field input-field col s6")
              div(class="btn")
                span Main Image 
                input(type="file" @change="setFilePath" id="image" v-validate="'required'" name="postImage")
                span(class="validation-error") {{ errors.first('postImage') }}
              div(class="file-path-wrapper")
                input(class="file-path" type="text" v-model="filePath")
          div(class="row")
            button(type="submit" class="btn" @click.prevent="submitForm") Create


</template>

<script>
// Check from where user come from 
import fetchCategories from '../apollo/Queries/fetchCategories.js';
// Functions
import capitalizeFirstLetter from '../assets/functions/firstLetterUppercase.js';
import fetchLimit from '../assets/functions/fetchLimit.js';
import getTodayDate from '../assets/functions/getTodayDate.js';
// Mutations
import addPost from '../apollo/Mutations/addPost.js';
// Axios
import axios from 'axios';
  export default {
    name: "AddPost",
    middleware: 'auth',
    async asyncData({ app }) {
      let client = app.apolloProvider.defaultClient;
      let returnedCategories = await client.query({
        query: fetchCategories
      });
      console.log(returnedCategories);
      return {
        categories: returnedCategories
      }    
    },
    $_veeValidate: {
      validator: 'new'
    },
    data(){
      return {
        category: "",
        limit: 5,
        showMoreState: true,
        filePath: "",
        postTitle: "",
        postText: "",
        imageName: ""
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
      setFilePath: function (file) {
        console.log(file.target.files[0].name);
        this.filePath = file.target.files[0].name;
      },
      async submitForm () {
        const isValid = await this.$validator.validateAll();
        let self = this;
        if(!isValid) return;
        // Validation 
        if(isValid) {
          async function postImageToServer() {
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
            let post = await client.mutate({
              mutation: addPost,
              variables: {
                title: self.postTitle,
                text: self.postText,
                authorId: self.$store.getters['user/GET_ID'],
                categoryName: self.category,
                createdAt: getTodayDate(),
                image: self.imageName
              }
            }).catch((error) => console.log(error));   
            console.log(post);                                
          }
          // Call The Function
          postImageToServer();
          // Test SSH
        }
      }
    }
  }
</script>
