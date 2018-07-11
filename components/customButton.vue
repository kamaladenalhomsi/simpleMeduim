<template lang="pug">
  button(:class="'waves-effect waves-light btn ' + addClass" :type="btnType", @click="clicked")
    span(class="button-text") {{ buttonText }}
    i(class="material-icons" v-if="icon") {{ iconClass }}
</template>
<script>
  export default {
    name: 'customButton',
    props: {
      buttonText: {
        type: String,
        required: true,
      },
      icon: {
        type: Boolean,
        default: false
      },
      iconClass: {
        type: String,
      },
      addClass: String,
      btnType: {
        type: String,
        default: "button"
      },
      clicked: String
    }
  }
</script>