<template>
    <div class="hello">
        <h1>Supermemo</h1>

        <a href="#!" @click="login">Log in</a>

        <p>
            <img :src="userImage" alt=""/>
            User: <span>{{user}}</span><br/>
            Token: <span>{{token}}</span>
        </p>
    </div>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data: function () {
            return {
                token: null,
                user: null
            };
        },
        methods: {
            login: function () {
                let provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    this.token = result.credential.accessToken;
                    // The signed-in user info.
                    this.user = result.user;
                    this.userImage = this.user.photoURL;

                }.bind(this)).catch(function () {
                    // Handle Errors here.
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    // The email of the user's account used.
                    // var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    // var credential = error.credential;
                    // ...
                });

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
