<template>
  <div>
    <Navbar></Navbar>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';
  export default {
    name: 'default',
    components: {
      Navbar
    }
  }
</script>
