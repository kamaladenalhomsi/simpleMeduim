<template lang="pug">
    div(id="signUp")
      div(class="container fourteen")
        div(class="custom-margin")
          MaterialBox()
           h3(class="auth-heading") Sign Up
           form(class="signUpForm" @submit="testForm")
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") person_pin
                input(class="validate" type="text" placeholder="First Name" v-model="firstName" required)
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") email
                input(class="validate" type="email" placeholder="Email" v-model="email" required)
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") wb_auto              
                input(class="validate" type="text" placeholder="User Name" v-model="username" required)
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") lock
                input(class="validate" type="password" placeholder="Password" v-model.prevent="password" required)      
            button(class="waves-effect waves-light btn" type="submit", v-on:click="testForm")
              span(class="button-text") Submit
              i(class="material-icons") create
          h1(v-if="done") Success
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
import addUser from '../apollo/Mutations/addUser.js';
const jssha = require('jssha');
const saltRounds = 10;
// Functions
function encryptPass(pass) {
  var shaObj = new jssha("SHA-512", "TEXT");
  shaObj.update(pass);
  var hash = shaObj.getHash("HEX");
  return hash;
}
//Components
export default {
  name: "signUp",
  components: {
      MaterialBox,
  },
  data(){
    return {
      firstName:"",
      email: "",
      password: "",
      username: "",
      done: false
    }
  },
  methods: {
    testForm() {
      let client = this.$apolloProvider.defaultClient;
      let returnedData = client.mutate({
        mutation: addUser,
        variables: {
          name: this.firstName,
          email: this.email,
          password: encryptPass(this.password),
          username: this.username
        }
      })
      .then(this.done = true)
      .catch((err) => {
        console.log(err);
      });
    } 
  }
}
</script>