<template>
    <div class="home">
        <h1>Schedule</h1>

        <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
            <thead>
            <tr>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>D</th>
                <th>E</th>
                <th>F</th>
                <th>G</th>
                <th>H</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="day in days" :key="day.date" :id="day.date">
                <td>{{day.date}}</td>
                <playlist-cell v-for="(sm) in day.studyMoments" :key="sm.id" :study-moment="sm"/>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';
    import {scheduleService} from '../services/StudyScheduleService';
    import PlaylistCell from "./PlaylistCell";

    export default {
        name: 'Home',
        components: {PlaylistCell},
        props: {
            msg: String
        },
        mounted: function () {
            const self = this;
            scheduleService.getDays().then(it => {
                self.days = it;
            }).then(() =>
                self.$nextTick(() => {
                    let todaysRowId = self.formatDateAsISO(new Date());
                    document.getElementById(todaysRowId).scrollIntoView();
                })
            );


        },
        data: function () {
            return {
                days: []
            };
        },
        methods: {
            formatDate(d) {
                return moment(d).format('dddd DD MMM YYYY');
            },
            formatDateAsISO(d) {
                return moment(d).format('YYYY-MM-DD');
            },
            isDone(playlist) {
                return playlist && playlist.done;
            },
            getName(playlist) {
                return (playlist || {name: ''}).name;
            },
            realDate(s) {
                return moment(s).format('dddd DD MMM YYYY');
            }
        }
    }
</script>

<style scoped>

    td {
        padding: 0.5em 1em 0.5em 1em;
        border: 1px solid gray;
    }


</style>
