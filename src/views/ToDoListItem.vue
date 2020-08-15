<template>
  <div class="todo-item">

    <a v-if="studymoment.spotifyPlaylistId"
       :href="'spotify:playlist:' + studymoment.spotifyPlaylistId">{{ studymoment.playlist }}</a>
    <span v-else> {{ studymoment.playlist }}</span>

    <div v-if="loading">...</div>
    <a v-else href="#!" @click.stop.prevent="setDone()"><i class="material-icons">done</i></a>

    <a v-if="studymoment.spotifyPlaylistId" href="#" @click.stop.prevent="exportAnkiCsv()">Export Anki csv</a>
  </div>
</template>

<style>
.todo-item {
  display: grid;
  grid-template-columns: 10rem 10rem 15rem;

}
</style>

<script>
import {scheduleService} from '../services/StudyScheduleService';

export default {
  name: "ToDoListItem",
  props: {
    studymoment: null
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    exportAnkiCsv() {
      alert("Exporting...");
    },
    setDone() {
      const self = this;
      this.loading = true;
      const doneHandler = function () {
        this.loading = false;
        self.$emit("done", self.studymoment)
      }.bind(this);

      scheduleService.setDone(self.studymoment)
          .then(() => doneHandler());
    }
  }
}
</script>