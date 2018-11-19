<template>
    <div class="home">
        <h1>Spotify playlists</h1>

        <spotify-login></spotify-login>

        <a href="#!" @click="scanAllSupermemoPlaylists" class="mdl-button mdl-button--colored">Import all playlists</a>

        <ul>
            <li v-for="playlist in playlists" :key="playlist.id">{{playlist.name}}
                <a @click.stop.prevent="scan(playlist)">Scan</a></li>
        </ul>
    </div>
</template>

<script>
    /* eslint-disable no-console */

    import ToDoList from "./ToDoList";
    import SpotifyLogin from "./SpotifyLogin";
    import {spotifyDataService} from "../services/SpotifyService";
    import {scheduleService} from "../services/StudyScheduleService";

    export default {
        name: 'Home',
        components: {SpotifyLogin, ToDoList},
        props: {
            msg: String
        },
        mounted: function () {
            this.fetchPlaylists();
        },
        data: function () {
            return {
                playlists: []
            };
        },
        methods: {
            /**
             *
             * @param playlist {SpotifyPlaylist}
             */
            scan(playlist) {
                let saveTracks = function (tracks) {
                    for (const track of tracks) {
                        scheduleService.saveTrack(track, playlist)
                    }
                };
                spotifyDataService.getTracks(playlist)
                    .then(tracks => saveTracks(tracks));
            },
            scanAllSupermemoPlaylists() {
                function _isSupermemoPlaylist(pl) {
                    return new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(pl.name);
                }

                const self = this;
                for (const pl of this.playlists) {
                    if (_isSupermemoPlaylist(pl)) {
                        self.scan(pl);
                    }
                }
            },
            fetchPlaylists: function () {
                const self = this;
                scheduleService
                    .fetchPlaylists()
                    .then(playlists => self.playlists = playlists);
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
