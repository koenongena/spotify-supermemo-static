<template>
    <p v-if="!spotifyAccessToken">
        Je bent momenteel niet geauthenticeerd bij Spotify.
        <br/> Klik <a href="#!" @click="loginSpotify">hier</a> om in te loggen.
    </p>
    <p v-else>
        Yippie, you are logged in with Spotify.
    </p>
</template>

<script>

    export default {
        name: 'SpotifyLogin',
        props: {
            msg: String
        },
        mounted: function () {
            this.spotifyAccessToken = localStorage.getItem('sp-accessToken');
            if (this.spotifyAccessToken) {
                let expirationDate = Date.parse(localStorage.getItem("sp-accessTokenExpiration"));
                if (!expirationDate || expirationDate < new Date()) {
                    this.spotifyAccessToken = null;
                    localStorage.setItem('sp-accessToken', null)
                }
            }
        },
        data: function () {
            return {
                spotifyAccessToken: null,
                spotifyAccessTokenExpiresIn: null
            };
        },
        methods: {
            loginSpotify: function () {
                var CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
                var REDIRECT_URI = process.env.VUE_APP_SPOTIFY_REDIRECT_URL;

                function getLoginURL(scopes) {
                    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                        '&scope=' + encodeURIComponent(scopes.join(' ')) +
                        '&response_type=token';
                }

                const url = getLoginURL(['playlist-read-private']),
                    width = 450,
                    height = 730,
                    left = (screen.width / 2) - (width / 2),
                    top = (screen.height / 2) - (height / 2);


                let spotifyLoginWindow = window.open(url,
                    'Spotify',
                    'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                );

                var self = this;
                spotifyLoginWindow.onbeforeunload = function () {
                    self.spotifyAccessToken = localStorage.getItem('sp-accessToken');
                    self.spotifyAccessTokenExpiresIn = localStorage.getItem('sp-accessTokenExpiresIn');
                };


            }
        }
    }
</script>

<style scoped>

</style>
