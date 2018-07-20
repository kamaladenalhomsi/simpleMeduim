<template lang="pug">
  div(id="navbar")
    nav 
      div(class="nav-wrapper")
        div(class="container")
          nuxt-link(to="home" class="brand-logo website-logo") Medium
          ul(id="nav-mobile" class="right hide-on-med-and-down")
            li 
              a(href="/logout" class="navbar-link") Logout
            li 
              nuxt-link(to="/addPost" class="navbar-link") Add Post
            li 
              nuxt-link(to="/userPosts" class="navbar-link") My Posts
</template>
<script>
  export default {
    name: "navbar"
  }
</script>