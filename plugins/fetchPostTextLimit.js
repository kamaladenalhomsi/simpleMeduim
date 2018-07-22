import Vue from 'vue';

Vue.filter('textLimit', (val) => {
  return val.substring(0, 400);
});