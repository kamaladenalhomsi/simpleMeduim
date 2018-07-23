<template lang="pug">
  div(id="signIn0")
    div(class="container fourteen")
      div(class="custom-margin")
        MaterialBox
          h3(class="auth-heading") Sign In
          form(class="signUpForm" @submit="submitForm")
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") email
                input(class="validate" type="email" placeholder="Email" v-model="email" v-validate="'required|email'" name="email")
                span(class="validation-error") {{ errors.first('email') }}
            div(class="row")
              div(class="input-field col s12")
                i(class="material-icons prefix") lock
                input(class="validate" type="password" placeholder="Password" v-model="password" v-validate="'required'" name="password")     
                span(class="validation-error") {{ errors.first('password') }}
            button(class="waves-effect waves-light btn submitButton" type="submit", v-on:click.prevent="submitForm" id="submitButton")
              span(class="button-text") LOGIN
              i(class="material-icons") arrow_forward_ios
            Errors(:passErrors="errorsText" v-if="errorsOn")
            span(class="auth-redirect") do not have an acount? 
              nuxt-link(to="/signUp") Create Acount!
      SuccessMessage(:message="successMessage" v-if="successMessageOn")
</template>
<script>
// Components
import MaterialBox from '../components/regularMaterialBox.vue';
import SuccessMessage from '../components/successMessage.vue';
import Errors from '../components/errors.vue';
// Queries
import checkUserQuery from '../apollo/Queries/loginCheck.js';
import loginCheck from '../apollo/Queries/loginCheck.js';
// Functions 
import encryptPass from '../assets/functions/encryptPass.js';
// Axios
import axios from 'axios';
  export default {
    middleware: "anonymous",
    layout: 'auth',
    name: 'signIn',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      MaterialBox,
      SuccessMessage,
      Errors
    },
    data() {
      return {
        email: "",
        password: "",
        clicked: false,
        successMessage: "",
        successMessageOn: false,
        errorsText: [],
        errorsOn: false,
      }
    },
    methods: {
      async submitForm() {
        this.errorsOn = false;
        const isValid = await this.$validator.validateAll();
        if(!isValid) return;
        if(isValid) {
          let button = document.getElementById('submitButton');
          button.innerText = "Loging you on...";
          button.classList.toggle('disabled');
          // Defien Apollo Client 
          let client = this.$apolloProvider.defaultClient;
          // Check If User Exist in the DataBase
          let userCheck = client.query({
            query: loginCheck,
            variables: {
              email: this.email,
              password: encryptPass(this.password)
            }
          }).then((data) => {
            if(data.data.loginCheck.status_code === "Success") {
                async function makeSession() {
                try {
                let { data: res } = await axios.post('http://localhost:3000/login', {
                    token: data.data.loginCheck.token,
                    name: data.data.loginCheck.name,
                    username: data.data.loginCheck.username,
                    id: data.data.loginCheck.id
                });
                } catch(e) {
                  console.log(e);
                }
              }
              makeSession();
              this.successMessageOn = true;
              this.successMessage = "You have Logined in Successfully";  
              this.$store.commit('user/SET_TOKEN', data.data.loginCheck.token);
              setTimeout(() => {
                this.successMessageOn = false;
              }, 3000);  
              window.location = "/home"; 
            }else {
              let button = document.getElementById('submitButton');
              button.innerText = "Login";
              button.classList.toggle('disabled');
              this.errorsOn = true;
              this.errorsText.push("Incorrect email or password");
              setTimeout(() => {
                this.errorsOn = false;
              }, 3000);
            }
          });
        }
      }
    },
  }
</script>