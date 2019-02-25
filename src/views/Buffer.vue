<template>
    <div>
        <div>
            <a href="#" @click="pop10" class="button button-primary">Pop 10</a>
            &nbsp;
            <a href="#" @click="pop5" class="button button-primary">Pop 5</a>
        </div>
        <p v-if="loading">Loading...</p>
        <ul>
            <li v-for="song in songs">
                {{song.artist}} - {{song.title}} ({{song.weight}})
            </li>
        </ul>

    </div>
</template>

<script>

    import {bufferService} from "../services/BufferService";
    import {spotifyDataService} from "../services/SpotifyService";

    export default {
        name: "Buffer",
        data: function () {
            return {
                songs: [],
                loading: false
            }
        },
        mounted: function () {
            const self = this;
            bufferService.getBuffer()
                .then(it => self.songs = it)
        },
        methods: {
            addSongsToSPotify: function (count) {
                const songsToAdd = this.songs.slice(0, count);
                let self = this;
                self.loading = true;

                spotifyDataService.createPlaylist("New playlist")
                    .then((playlistId) => {
                        spotifyDataService.addTracks(playlistId, songsToAdd)
                            .then(() => {
                                self.loading = false;
                                self.songs = self.songs.slice(count);
                                bufferService.deleteFromBuffer(songsToAdd);
                            });
                    });
            },
            pop10: function () {
                this.addSongsToSPotify(10);


            },
            pop5: function () {
                this.addSongsToSPotify(1);
            }
        }

    }
</script>

<style scoped>

</style>