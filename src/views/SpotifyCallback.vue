<template>
    <p>Hooray, you are logged in</p>
</template>

<script>
    export default {
        name: "SpotifyCallback",
        mounted: function(){
            let getHashParams = function () {
                var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                e = r.exec(q)
                while (e) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                    e = r.exec(q)
                }
                return hashParams;
            };

            let hashParams = getHashParams();
            localStorage.setItem("sp-accessToken", hashParams['access_token']);
            localStorage.setItem("sp-accessTokenType", hashParams['token_type']);
            localStorage.setItem("sp-accessTokenExpiresIn", hashParams['expires_in']);
            localStorage.setItem("sp-accessTokenExpiration", Date.now() + hashParams['expires_in']);

            setTimeout(() => window.close(), 1000);
        }
    }
</script>

<style scoped>

</style>