<template>
    <div class="home">
        <h1>Supermemo</h1>

        <spotify-login/>

        <h1>TO DO</h1>

        <to-do-list/>


        <!--<ul>-->
            <!--<li v-for="(studyMoment, index) in studyMoments" :key="index">-->
                <!--<a href="#!" @click.stop.prevent="setDone(studyMoment)">Done</a></li>-->
        <!--</ul>-->

        <button @click.stop.prevent="addPlaylist">Add playlist for today</button>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import axios from 'axios';
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
            fetchPlaylists: function () {
                let self = this;
                let headers = {
                    'Authorization': "Bearer " + self.spotifyAccessToken
                };
                axios.get(" https://api.spotify.com/v1/me/playlists", {headers: headers})
                    .then(response => self.playlists = response.data)
                    .catch(error => self.error = error.message);
            },

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
