import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'

Vue.config.productionTip = false;

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: "spotify-supermemo.firebaseapp.com",
    databaseURL: "https://spotify-supermemo.firebaseio.com",
    projectId: "spotify-supermemo",
    storageBucket: "spotify-supermemo.appspot.com",
    messagingSenderId: "966364522668"
};

firebase.initializeApp(config);

let app;
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            render: h => h(App)
        });
        app.$mount('#app')
    }

});

