<template lang="pug">
    div(id="signUp")
      div(class="container fourteen")
        div(class="custom-margin")
          MaterialBox
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
            button(class="waves-effect waves-light btn" type="submit", v-on:click.prevent="testForm")
              span(class="button-text") Submit
              i(class="material-icons") create
          h1(v-if="done") Success
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
// Mutations
import addUser from '../apollo/Mutations/addUser.js';
// Queries
import checkUserQuery from '../apollo/Queries/checkUser.js';
// Functions
import encryptPass from '../assets/functions/encryptPass.js';
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
      // Defien Apollo Client 
      let client = this.$apolloProvider.defaultClient;            
      // Check If User Exist in the DataBase 
      let checkUser = client.query({
        query: checkUserQuery,
        variables: {
          username: this.username,
          email: this.email
        }
      }).then((data) => {
        if(data.data.checkUser.status_code === "Error") {
          console.log("It is Error");
        }
      });
      // Make Add User Mutation
      // let returnedData = client.mutate({
      //   mutation: addUser,
      //   variables: {
      //     name: this.firstName,
      //     email: this.email,
      //     password: encryptPass(this.password),
      //     username: this.username
      //   }
      // })
      // .then((data) => {

      //   console.log(data);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
    } 
  }
}
</script>