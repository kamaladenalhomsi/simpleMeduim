<template lang="pug">
    div(id="signUp")
      div(class="container fourteen")
        div(class="custom-margin")
          MaterialBox
           h3(class="auth-heading") Sign Up
           form(class="signUpForm" @submit="submitForm")
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") person_pin
                input(class="validate" type="text" placeholder="First Name" v-model="firstName" v-validate="'required'" name="firstname")
                span(class="validation-error") {{ errors.first('firstname') }}
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") email
                input(class="validate" type="email" placeholder="Email" v-model="email" v-validate="'required|email'" name="email")
                span(class="validation-error") {{ errors.first('email') }}
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") wb_auto              
                input(class="validate" type="text" placeholder="User Name" v-model="username" v-validate="'required|min:5'" name="username")
                span(class="validation-error") {{ errors.first('username') }}
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") lock
                input(class="validate" type="password" placeholder="Password" v-model="password" v-validate="'required|min:5'" name="password")     
                span(class="validation-error") {{ errors.first('password') }}
            button(class="waves-effect waves-light btn submitButton" type="submit", v-on:click.prevent="submitForm" id="submitButton")
              span(class="button-text") Create
              i(class="material-icons") create
            nuxt-link(to="/signIn" class="auth-redirect") already have an ancount?
            SuccessMessage(:message="successMessage" v-if="successMessageOn")
            Errors(:passErrors="errorsText" v-if="errorsOn")
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
import Errors from '../components/errors.vue';
import SuccessMessage from '../components/successMessage.vue';
// Mutations
import addUser from '../apollo/Mutations/addUser.js';
// Queries
import checkUserQuery from '../apollo/Queries/checkUser.js';
// Functions
import encryptPass from '../assets/functions/encryptPass.js';
//Axios
import axios from 'axios'
import { setTimeout } from 'timers';
// My Sign up Page
export default {
  middleware: "anonymous",
  layout: 'auth',
  name: "signUp",  
  $_veeValidate: {
    validator: 'new'
  },
  components: {
      MaterialBox,
      Errors,
      SuccessMessage,
  },
  data(){
    return {
      firstName:"",
      email: "",
      password: "",
      username: "",
      errorsText: [],
      errorsOn: false,
      successMessage: "",
      successMessageOn: false,
      clicked: false
    }
  },
  watch: {
    clicked: function() {
      let button = document.getElementById('submitButton');
      button.innerText = "Creating...";
      button.className += " disabled";
    }
  },
  methods: {
    async submitForm() {
      const isValid = await this.$validator.validateAll();
      if(!isValid) return;
      // Validation 
      if(isValid) {
      //Assign 
      this.clicked = true;
      this.errorsOn = false;
      this.successMessageOn = false;
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
        console.log(data);
        if(data.data.checkUser.status_code === "Success") {
          // Make Add User Mutation
          let returnedData = client.mutate({
            mutation: addUser,
            variables: {
              name: this.firstName,
              email: this.email,
              password: encryptPass(this.password),
              username: this.username
            }
          })
          .then(async (data) => {
            this.$store.commit('user/SET_TOKEN', data.data.addUser.token);
            this.successMessageOn = true;
            this.successMessage = "You have signed up Successfully";  
            setTimeout(() => {
              this.successMessageOn = false;
            }, 3000);                                        
            try {
            let { data: res } = await axios.post('http://localhost:3000/sign', {
                token: data.data.addUser.token,
                name: data.data.addUser.name,
                username: data.data.addUser.username,
                id: data.data.addUser.id
            });
            } catch (error) {
              console.log(error)
            }
          })
          .catch((err) => {
            console.log(err);
          });
          setTimeout(() => {
            window.location = "/home"; 
          }, 3000);                                                                     
        } else {
          this.errorsOn = true;
          this.errorsText.push("This username or email is already exist!");
        }
        });
      }else {
        console.log("!==0", formErrors);
        this.errorsText = "";
        this.errorsOn = true;          
        this.errorsText = formErrors.slice();
      }  
    } 
  }
}

</script>