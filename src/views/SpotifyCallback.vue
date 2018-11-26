<template>
    <p>Hooray, you are logged in</p>
</template>

<script>
    import store from "../store";

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

            store.dispatch('registerSpotifyLoginCallback', hashParams);
            setTimeout(() => window.close(), 1000);
        }
    }
</script>

<style scoped>

</style>