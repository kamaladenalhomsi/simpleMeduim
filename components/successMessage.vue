<template lang="pug">
  div(class="successMessage")
    h6 {{ message }}
</template>

<script>
  export default {
    name: 'successMessage',
    props: {
      message: {
        type: String,
        required: true
      }
    }
  }
</script>
