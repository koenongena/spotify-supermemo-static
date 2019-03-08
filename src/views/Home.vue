<template>
    <div class="home">
        <h1>TO DO</h1>

        <to-do-list :study-moments="studyMoments" />

        <button @click.stop.prevent="addPlaylist">Add playlist for today</button>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import ToDoList from "./ToDoList";
    import {mapState} from 'vuex';
    import store from "../store";

    export default {
        name: 'Home',
        components: {ToDoList},
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
                store.dispatch("addPlaylist");
            },
            /**
             *
             * @param study {Study}
             */
            setDone(study) {
                store.dispatch("setPlaylistDone", study);
            }
        }
    }
</script>
