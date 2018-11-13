<template>
    <div class="home">
        <h1>Spotify playlists</h1>

        <spotify-login></spotify-login>

        <ul>
            <li v-for="playlist in playlists" :key="playlist.id">{{playlist.name}}</li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios';
    import ToDoList from "./ToDoList";
    import SpotifyLogin from "./SpotifyLogin";
    import SpotifyPlaylist from "../model/SpotifyPlaylist";

    export default {
        name: 'Home',
        components: {SpotifyLogin, ToDoList},
        props: {
            msg: String
        },
        mounted: function () {
            this.spotifyAccessToken = localStorage.getItem('sp-accessToken');

            this.fetchPlaylists();
        },
        data: function () {
            return {
                playlists: []
            };
        },
        methods: {
            fetchPlaylists: function () {
                let self = this;
                let headers = {
                    'Authorization': "Bearer " + self.spotifyAccessToken
                };

                this._fetchPlaylists("https://api.spotify.com/v1/me/playlists");

            },

            _fetchPlaylists(url) {
                let self = this;
                let headers = {
                    'Authorization': "Bearer " + self.spotifyAccessToken
                };

                axios.get(url, {headers: headers})
                    .then(response => {
                        let data = response.data;
                        self.playlists = self.playlists.concat(data.items.map(it => new SpotifyPlaylist(it)));
                        if (data.next) {
                            self._fetchPlaylists(data.next);
                        }
                    })
                    .catch(error => self.error = error.message);
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
