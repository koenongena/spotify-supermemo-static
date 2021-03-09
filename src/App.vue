<template>
    <div id="app">
        <header>
            <h1>Supermemo - spotify</h1>
        </header>
        <aside>
            <router-link to="/home">Home</router-link>
            <router-link to="/schedule">Schedule</router-link>
            <router-link to="/spotify-playlists">Spotify playlists</router-link>
            <router-link to="/buffer">Buffer</router-link>

            <div id="status-bar">
                <img v-if="$store.state.spotifyAccessToken" src="./assets/spotify_green.png" width="32" height="32" title="You are logged in with spotify"/>
                <a href="#" @click="$store.dispatch('spotifyLogin')" v-else>
                    <img  src="./assets/spotify_grey.png" width="32" height="32"/>
                </a>
            </div>
        </aside>

        <main>
            <router-view/>
        </main>
    </div>
</template>

<script>
    export default {
        mounted: function () {
            this.$store.dispatch("loadSpotifyAccessToken");

        },
    }
</script>