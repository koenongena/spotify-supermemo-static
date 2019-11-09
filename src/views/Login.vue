<template>
    <div>
        <h1>Spotify supermemo</h1>
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
    </div>
</template>

<script>
    import firebase from 'firebase';

    const firebaseui = require('firebaseui');

    export default {
        name: "Login"
        ,
        mounted: function () {
            const ui = new firebaseui.auth.AuthUI(firebase.auth());

            var uiConfig = {
                callbacks: {
                    signInSuccessWithAuthResult: function () {
                        // User successfully signed in.
                        // Return type determines whether we continue the redirect automatically
                        // or whether we leave that to developer to handle.
                        return true;
                    },
                    uiShown: function () {
                        // The widget is rendered.
                        // Hide the loader.
                        document.getElementById('loader').style.display = 'none';
                    }
                },
                // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
                signInFlow: 'popup',
                signInSuccessUrl: '/',
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID
                ]
            };


            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }
</script>

<style scoped>
    @import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>