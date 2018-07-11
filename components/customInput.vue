<template lang="pug">
  div(class="row")
    div(:class="'input-field ' + 'col ' + sizeCol")
      i(class="material-icons prefix") {{ iconName }}
      input(class="validate" :type="inputType" :placeholder="placeholderText" :required="inputRequired" :v-model="model")
</template>
<script>
  export default {
    name: "CustomInput",
    props: {
      iconName: {
        type: String,
        required: true
      },
      placeholderText: {
        type: String,
        required: true
      },
      sizeCol: {
        type: String,
        default: "s6"
      },
      inputType: {
        type: String,
        default: "text"
      },
      inputRequired: String,
      model: String
    },
      data(){
    return {
      firstName:"",
      lastName: "",
      password: "",
    }
  },
  }
</script>

<style lang="stylus">
  .signUpForm 
    margin-top 50px
</style>

