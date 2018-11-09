<template>
    <div class="home">
        <h1>Supermemo</h1>

        <p v-if="!spotifyAccessToken">
            Je bent momenteel niet geauthenticeerd bij Spotify.
            <br/> Klik <a href="#!" @click="loginSpotify">hier</a> om in te loggen.
        </p>
        <p v-else>
            Yippie, you are logged in with Spotify.
        </p>

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

    export default {
        name: 'Home',
        components: {ToDoList},
        props: {
            msg: String
        },
        mounted: function () {
            this.spotifyAccessToken = localStorage.getItem('sp-accessToken');


            var self = this;
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
            loginSpotify: function () {
                var CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
                var REDIRECT_URI = process.env.VUE_APP_SPOTIFY_REDIRECT_URL;

                function getLoginURL(scopes) {
                    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                        '&scope=' + encodeURIComponent(scopes.join(' ')) +
                        '&response_type=token';
                }

                const url = getLoginURL(['playlist-read-private']),
                    width = 450,
                    height = 730,
                    left = (screen.width / 2) - (width / 2),
                    top = (screen.height / 2) - (height / 2);


                let spotifyLoginWindow = window.open(url,
                    'Spotify',
                    'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                );

                var self = this;
                spotifyLoginWindow.onbeforeunload = function () {
                    self.spotifyAccessToken = localStorage.getItem('sp-accessToken');
                    self.spotifyAccessTokenExpiresIn = localStorage.getItem('sp-accessTokenExpiresIn');
                };


            },

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
