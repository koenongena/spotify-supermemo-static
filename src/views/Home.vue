<template>
    <div class="home">
        <h1>Supermemo</h1>

        <spotify-login/>

        <h1>TO DO</h1>

        <to-do-list/>

        <button @click.stop.prevent="addPlaylist">Add playlist for today</button>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import {scheduleService} from '../services/StudyScheduleService';
    import ToDoList from "./ToDoList";
    import SpotifyLogin from "./SpotifyLogin";

    export default {
        name: 'Home',
        components: {SpotifyLogin, ToDoList},
        props: {
            msg: String
        },
        mounted: function () {
            const self = this;
            scheduleService.getTodoList().then(it => {
                self.studyMoments = it;
            });
        },
        data: function () {
            return {
                user: null,
                error: "",
                playlists: [],
                spotifyAccessToken: null,
                spotifyAccessTokenExpiresIn: null,
                db: null,
                studyMoments: []
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
