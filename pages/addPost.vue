<template lang="pug">
  div(id="addPost")
    div(class="container")
      div(class="custom-margin")
        h1(class="page-heading") Add Post  
      div(class="form-outter")
        form()
          div(class="row")
            div(class="input-field col s6")
              input(id="first_name" type="text" class="validate" placeholder="Post Title")
          div(class="row")
            div(class="input-field col s6")
              textarea(class="materialize-textarea post-textarea" placeholder="Post Text")
</template>

<script>
  export default {
    name: "AddPost"
  }
</script>
