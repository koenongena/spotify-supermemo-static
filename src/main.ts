import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

const config = {
    apiKey: "AIzaSyAw8sEeK2Q6uy5uB9jtTKZu185ZE23hmEM",
    authDomain: "spotify-supermemo.firebaseapp.com",
    databaseURL: "https://spotify-supermemo.firebaseio.com",
    projectId: "spotify-supermemo",
    storageBucket: "spotify-supermemo.appspot.com",
    messagingSenderId: "966364522668"
};

firebase.initializeApp(config);

let app:Vue;
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        });
        app.$mount('#app')
    }

});
