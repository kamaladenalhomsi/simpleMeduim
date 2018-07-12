<template lang="pug">
  div(class="errors-outter")
    ul(class="errors")
      li(v-for="error in passErrors") {{ error }}

</template>
<script>
  export default {
    name: 'errors',
    props: {
      passErrors: {
        required: true,
        type: Array
      }
    }
  }
</script>
