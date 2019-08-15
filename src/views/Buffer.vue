<template>
    <div>
        <div class="mdl-card__actions" v-if="$store.state.spotifyAccessToken">
            <a href="#" @click="pop(25)" class="button button-primary">Pop 25</a>&nbsp;
            <a href="#" @click="pop(10)" class="button button-primary">Pop 10</a>&nbsp;
            <a href="#" @click="pop(5)" class="button button-primary">Pop 5</a>
            &nbsp;
            <a href="#" @click="random(25)" class="button button-primary">Random 25</a>&nbsp;
            <a href="#" @click="random(10)" class="button button-primary">Random 10</a>&nbsp;
            <a href="#" @click="random(5)" class="button button-primary">Random 5</a>&nbsp;
        </div>

        <div v-if="$store.state.loading">
            <spinner></spinner>
            <p>Loading...</p>
        </div>

        <ol>
            <li v-for="song in $store.state.buffer" v-bind:key="song.id">
                {{song.artist}} - {{song.title}} ({{song.weight}})
            </li>
        </ol>

    </div>
</template>

<script>

    import Spinner from "./Spinner";

    export default {
        name: "Buffer",
        components: {Spinner},
        mounted: function () {
            this.$store.dispatch("loadBuffer");
        },
        methods: {
            pop: function (count) {
                this.$store.dispatch("popFromBuffer", count);
            },
            random: function (count) {
                this.$store.dispatch("randomFromBuffer", count);
            }
        }

    }
</script>

<style scoped>

</style>