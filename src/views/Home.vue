<template>
    <div class="home">
        <h1>Supermemo</h1>

        <spotify-login/>

        <h1>TO DO</h1>

        <to-do-list :study-moments="studyMoments" />

        <button @click.stop.prevent="addPlaylist">Add playlist for today</button>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import {scheduleService} from '../services/StudyScheduleService';
    import ToDoList from "./ToDoList";
    import SpotifyLogin from "./SpotifyLogin";
    import { mapState } from 'vuex';
    import store from "../store";

    export default {
        name: 'Home',
        components: {SpotifyLogin, ToDoList},
        props: {
            msg: String
        },
        computed: {
            ...mapState(["studyMoments"])
        },
        mounted: function () {
            store.dispatch("loadStudyMoments");
        },
        data: function () {
            return {
                user: null,
                error: "",
                playlists: [],
                spotifyAccessToken: null,
                spotifyAccessTokenExpiresIn: null,
                db: null
            };
        },
        methods: {
            addPlaylist() {
                scheduleService.create(new Date())
                    .then((playlistName) => alert("Playlist " + playlistName + " added successfully"))
                    .catch((error) => self._log.error(error))
            },
            /**
             *
             * @param study {Study}
             */
            setDone(study) {
                const doneHandler = function () {
                    this.studyMoments = this.studyMoments.filter(sm => sm.id !== study.id);
                }.bind(this);

                scheduleService.setDone(study)
                    .then(() => doneHandler());
            }
        }
    }
</script>
