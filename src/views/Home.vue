<template>
    <div class="home">
        <h1>Supermemo</h1>

        <a href="#!" @click="login">Log in</a>

        <p>
            Token: <span>{{token}}</span>
        </p>

        <a :href="spotifyLoginURL" v-if="!spotifyAuthenticationToken">Spotify login</a>
        <a href="#!" @click="fetchPlaylists" v-else>Spotify playlists</a>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import axios from 'axios';

    export default {
        name: 'Home',
        props: {
            msg: String
        },
        mounted: function () {
            if (!localStorage.getItem('spotifyAuthenticationToken')) {
                let parseHash = function (s) {
                    return s
                        .substring(1)
                        .split('&')
                        .reduce(function (initial, item) {
                            if (item) {
                                const parts = item.split('=');
                                initial[parts[0]] = decodeURIComponent(parts[1]);
                            }
                            return initial;
                        }, {});
                };

                localStorage.setItem('spotifyAuthenticationToken', parseHash(this.$route.hash).access_token);
            }

            this.spotifyAuthenticationToken = localStorage.getItem('spotifyAuthenticationToken');
        },
        data: function () {
            return {
                token: null,
                user: null,
                error: "",
                playlists: [],
                spotifyAuthenticationToken: null
            };
        },
        computed: {
            spotifyLoginURL: function () {
                let params = {
                    client_id: 'b04f52bb845a40909fad79d715ee2678',
                    response_type: 'token',
                    redirect_uri: 'http://localhost:8080',

                };
                var esc = encodeURIComponent;
                var query = Object.keys(params)
                    .map(k => esc(k) + '=' + esc(params[k]))
                    .join('&');

                return "https://accounts.spotify.com/authorize?" + query;
            }
        },
        methods: {
            login: function () {
                let provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    this.token = result.credential.accessToken;
                    // The signed-in user info.
                    this.user = result.user;

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

            },
            loginWithSpotify: function () {
                axios.get("https://accounts.spotify.com/authorize", {})
            },
            fetchPlaylists: function () {
                let self = this;
                let headers = {
                    'Authorization': "Bearer " + self.spotifyAuthenticationToken
                };
                axios.get(" https://api.spotify.com/v1/me/playlists", {headers: headers})
                    .then(response => self.playlists = response.data)
                    .catch(error => self.error = error.message);
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
