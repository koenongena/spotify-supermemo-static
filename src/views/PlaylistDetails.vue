<template>
  <div>
    <h1>Playlist {{ name }}</h1>
    <p v-bind:key="study.id" v-for="study in playlistDetails.studies" :class="{'done': study.done}">
      {{ study.date | formatDate }}</p>

    <label for="spotifyPlaylistId">Spotify playlist ID</label>
    <input type="text" id="spotifyPlaylistId" v-model="spotifyPlaylistId">
    <button @click.stop.prevent="updateSpotifyPlaylistId">Save (update all)</button>

    <br>

    <iframe v-if="playlistDetails.spotifyPlaylistId"
            :src="'https://open.spotify.com/embed/playlist/' + playlistDetails.spotifyPlaylistId" width="300"
            height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
  </div>
</template>

<script>
import store from "../store";
import {mapState} from "vuex";

export default {
  name: "PlaylistDetails",
  props: ['name'],
  created() {
    store.dispatch('getPlaylistDetails', this.name);
  },
  data: function () {
    return {
      updatedSpotifyPlaylistId: ''
    };
  },
  computed: {
    ...mapState(["playlistDetails"]),
    spotifyPlaylistId: {
      set(v) {
        this.updatedSpotifyPlaylistId = v;
      },
      get() {
        return this.playlistDetails.spotifyPlaylistId;
      }
    }
  },
  methods: {
    updateSpotifyPlaylistId() {
      const payload = {
        playlistName: this.name,
        spotifyPlaylistId: this.updatedSpotifyPlaylistId || this.playlistDetails.spotifyPlaylistId
      };
      store.dispatch("updateSpotifyPlaylistId", payload)
    }
  }
}
</script>

<style scoped>
.done {
  color: green;
}
</style>