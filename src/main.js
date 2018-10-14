import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'

Vue.config.productionTip = false;

var config = {
    apiKey: "AIzaSyAw8sEeK2Q6uy5uB9jtTKZu185ZE23hmEM",
    authDomain: "spotify-supermemo.firebaseapp.com",
    databaseURL: "https://spotify-supermemo.firebaseio.com",
    projectId: "spotify-supermemo",
    storageBucket: "spotify-supermemo.appspot.com",
    messagingSenderId: "966364522668"
};
firebase.initializeApp(config);


new Vue({
  render: h => h(App)
}).$mount('#app')
