<template>
    <div>
        <label for="a">Spotify playlist ID</label>
        <input type="text" v-model="spotifyPlaylistId">

        <div v-if="$store.state.loading">
            <spinner></spinner>
            <p>Loading...</p>
        </div>

        <a class="firebaseui-button" v-if="spotifyPlaylistId" href="#" @click.stop.prevent="exportAnkiCsv()">Export Anki csv</a>
    </div>
</template>

<script>

    import Spinner from "./Spinner";
    import { exportPreviewAnkiFile} from "@/views/exportPlaylist";
    import {files} from "@/utils/files";

    export default {
        name: "Anki",
        components: {Spinner},
        mounted: function () {
        },
        data: function () {
          return {
            spotifyPlaylistId: ''
          };
        },
        methods: {
          exportAnkiCsv() {
            const access_token = this.$store.state.spotifyAccessToken;

            if (access_token) {
              let playlistId = this.spotifyPlaylistId;
              exportPreviewAnkiFile(playlistId, access_token).then(csv => {
                const blob = new Blob(["\uFEFF" + csv], {type: "text/csv;charset=utf-8"});
                files.saveAs(blob, this.spotifyPlaylistId + ".csv");
              })
            } else {
              alert("Connect to spotify first, please");
            }
          }
        }

    }
</script>

<style scoped>

</style>
