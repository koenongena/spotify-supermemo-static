<template>
    <div class="home">
        <h1>Playlists</h1>

        <a href="#!" @click="getUnscannedPlaylists" class="button">Find unscanned playlists</a>

        <ul>
            <li v-for="playlist in unscannedPlaylists" :key="playlist.id">{{playlist.name}}
                <a href.stop.prevent="#!" @click.stop.prevent="scan(playlist)">Scan</a></li>
        </ul>

        <h1>Tracked playlists</h1>

        <a href="#" @click="showTrackedPlaylists">Show tracked playlists</a>

        <ul>
            <li v-for="playlist in trackedPlaylists" :key="playlist.id">{{playlist.name}} - weight {{playlist.weight}}</li>
        </ul>

        <a href="#!" class="button button-primary" @click="findNewSongs">Find new songs</a>
        &nbsp;
        <a v-if="newSongs.length > 0" href.stop.prevent="#!" @click="addToBuffer" class="button button-primary">Add to buffer</a>

        <div v-if="loading">
            <spinner></spinner>
            <p>{{loadingMessage}}</p>
        </div>

        <ol>
            <li v-for="song in newSongs" :key="song.id">
                <span class="mdl-list__item-primary-content">
                 {{song.artist}} - {{song.title}} (weight: {{song.weight}})
                </span>
            </li>
        </ol>


    </div>
</template>

<script>
    /* eslint-disable no-console */

    import {mapState} from 'vuex';
    import store from "../store";
    import Spinner from "./Spinner";

    export default {
        name: 'Home',
        components: {Spinner},
        props: {
            msg: String
        },
        computed: {
            ...mapState(["unscannedPlaylists", "trackedPlaylists", "newSongs", "loading", "loadingMessage"])
        },
        methods: {
            /**
             *
             * @param playlist {SpotifyPlaylist}
             */
            scan(playlist) {
                store.dispatch("scanPlaylist", playlist);
            },
            getUnscannedPlaylists() {
                store.dispatch("fetchUnscannedPlaylists");
            },
            findNewSongs() {
                store.dispatch("findNewSongs");
            },
            createPlaylist() {
                store.dispatch("createPlaylistFromNewSongs");
            },
            addToBuffer() {
                store.dispatch("addToBuffer");
            },
            showTrackedPlaylists() {
                this.$store.dispatch("loadTrackedPlaylists")
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
