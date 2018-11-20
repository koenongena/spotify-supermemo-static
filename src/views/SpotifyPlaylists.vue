<template>
    <div class="home">
        <h1>Spotify playlists</h1>

        <spotify-login></spotify-login>

        <a href="#!" @click="getUnscannedPlaylists" class="mdl-button mdl-button--colored">Find unscanned playlists</a>

        <ul>
            <li v-for="playlist in playlists" :key="playlist.id">{{playlist.name}}
                <a href.stop.prevent="#!" @click.stop.prevent="scan(playlist)">Scan</a></li>
        </ul>

        <h1>Tracked playlists</h1>

        <a href="#!" @click="findNewSongs">Find new songs</a>

        <ul class="demo-list-item mdl-list">
            <li class="mdl-list__item" v-for="song in newSongs" :key="song.id">
                <span class="mdl-list__item-primary-content">
                 {{song.artist}} - {{song.title}}
                </span>
            </li>
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
                playlists: [],
                newSongs: []
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
            getUnscannedPlaylists() {
                const self = this;

                let _isSupermemoPlaylist = function (pl) {
                    return new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(pl.name);

                };

                let addIfUnscanned = function (pl) {
                    scheduleService.getPlaylistsWithName(pl.name)
                        .then(playlist => {
                            if (!playlist.scanned) {
                                self.playlists.push(pl);
                            }
                        });
                };

                let addPlaylists = function (playlists) {
                    for (const playlist of playlists) {
                        if (_isSupermemoPlaylist(playlist)) {
                            addIfUnscanned(playlist);
                        }
                    }
                };

                spotifyDataService
                    .fetchPlaylists()
                    .then(playlists => addPlaylists(playlists));
            },
            fetchPlaylists: function () {
                const self = this;
                scheduleService
                    .fetchUnscannedPlaylists()
                    .then(playlists => self.playlists = playlists);
            },
            findNewSongs() {
                const self = this;
                self.newSongs = [];
                scheduleService.getTrackedPlaylists()
                    .then((playlists) => {
                        for (const playlist of playlists) {
                            spotifyDataService.getTracks(playlist)
                                .then(tracks => {
                                    for (const track of tracks) {
                                        scheduleService.isNew(track).then(b => {
                                            if (b) self.newSongs.push(track)
                                        })
                                    }
                                });
                        }

                    });

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
