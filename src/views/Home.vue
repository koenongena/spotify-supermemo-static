<template>
    <div class="home">
        <h1>TO DO</h1>

        <to-do-list :study-moments="studyMoments" />

        <div v-if="$store.state.loading">
            <p>Scanning tracks in playlist...</p>
            <spinner/>
        </div>

        <button @click.stop.prevent="addPlaylist">Add playlist for today</button>

        <p>{{ error }}</p>
    </div>
</template>

<script>
    import ToDoList from "./ToDoList";
    import {mapState} from 'vuex';
    import store from "../store";
    import Spinner from "@/views/Spinner";

    export default {
        name: 'Home',
        components: {Spinner, ToDoList},
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
