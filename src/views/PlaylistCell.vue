<template>
    <td :key="playlist.key" :class="{'done': done}">
        <a href="#!" @click.stop.prevent="toggleDone">{{getName(playlist)}}</a>
    </td>
</template>

<script>
    import moment from 'moment';
    import {scheduleService} from "../services/StudyScheduleService";

    export default {
        name: 'PlaylistCell',
        props: {
            playlist: null,
            day: null
        },
        data() {
            return {
                active: false,
                done: (this.playlist && this.playlist.done)
            }
        },

        methods: {
            isDone(playlist) {
                return playlist && playlist.done;
            },
            getName(playlist) {
                return (playlist || {name: ''}).name;
            },
            realDate(s) {
                return moment(s).format('dddd DD MMM YYYY');
            },
            toggleDone() {
                if (this.done) {
                    scheduleService.setPending(this.playlist.name, this.day.time);
                } else {
                    scheduleService.setDone(this.playlist.name, this.day.time);
                }
                this.done = !this.done;
            }
        }
    }
</script>

<style scoped>

    td {
        padding: 0.5em 1em 0.5em 1em;
        border: 2px solid gray;
    }

    td.done {
        background-color: lightgreen;
    }

    td a {
        color: #000;
        text-decoration: none;
    }
</style>
