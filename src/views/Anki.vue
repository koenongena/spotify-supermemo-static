<template>
  <div>
    <label for="a">Spotify playlist ID</label>
    <input type="text" v-model="spotifyPlaylistInput">
    <div>
      <span>or</span>
      <ul>
        <li><a href="#" @click.stop.prevent="exportDeAfrekening()">De Afrekening</a></li>
      </ul>
    </div>
    <div v-if="$store.state.loading">
      <spinner></spinner>
      <p>Loading...</p>
    </div>

    <br>
    <iframe v-if="spotifyPlaylistId" v-bind:src="`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}`"
            width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    <br/>
    <a class="button" v-if="spotifyPlaylistId" href="#" @click.stop.prevent="exportAnkiCsv()">Export Anki csv</a>

  </div>
</template>

<script>

import Spinner from "./Spinner";
import {exportPreviewAnkiFile} from "@/views/exportPlaylist";
import {files} from "@/utils/files";
import {extractSpotifyPlaylistID} from "@/services/SpotifyService";

const exportPlaylist = (accessToken, playlistId, name = playlistId) => {
  if (accessToken) {
    exportPreviewAnkiFile(playlistId, accessToken).then(csv => {
      const blob = new Blob(["\uFEFF" + csv], {type: "text/csv;charset=utf-8"});
      files.saveAs(blob, name + ".csv");
    })
  } else {
    alert("Connect to spotify first, please");
  }
}

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
  computed: {
    spotifyPlaylistInput: {
      get() {
        return this.spotifyPlaylistId;
      },
      set(input) {
        this.spotifyPlaylistId = extractSpotifyPlaylistID(input);
      }
    }
  },
  methods: {
    exportAnkiCsv() {
      exportPlaylist(this.$store.state.spotifyAccessToken, this.spotifyPlaylistId);
    },
    exportDeAfrekening() {
      const url = "https://open.spotify.com/playlist/6K43gHIAaERz5kYVSPldN2?si=245387c816604407";
      exportPlaylist(this.$store.state.spotifyAccessToken, extractSpotifyPlaylistID(url), "de_afrekening__" + new Date().toLocaleDateString());
    }
  }

};
</script>

<style scoped>

</style>
