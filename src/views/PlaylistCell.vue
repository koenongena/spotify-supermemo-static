<template>
    <td :class="{'done': studyMoment.done}">
        <a href="#!" @click.stop.prevent="toggleDone">{{studyMoment.playlist}}</a>
        <a href="#!" @click.stop.prevent="remove"><i class="material-icons">delete</i> </a>
    </td>
</template>

<script>
    import moment from 'moment';
    import {scheduleService} from "../services/StudyScheduleService";
    import Study from "../model/Study";

    export default {
        name: 'PlaylistCell',
        props: {
            studyMoment: {
                type: Study
            }
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
                if (this.studyMoment.done) {
                    scheduleService.setPending(this.studyMoment);
                } else {
                    scheduleService.setDone(this.studyMoment);
                }
                this.studyMoment.done = !this.studyMoment.done;
            },
            remove() {
                let handleChanges = function () {
                    alert(this.studyMoment.playlist + " was deleted");
                }.bind(this);

                scheduleService
                    .deletePlaylist(this.studyMoment.playlist)
                    .then(() => handleChanges());

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
