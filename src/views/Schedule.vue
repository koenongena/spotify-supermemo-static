<template>
    <div class="home">
        <h1>Schedule</h1>

        <table>
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
            <tr v-for="day in days" :key="day.name">
                <td>{{formatDate(day.date)}}</td>
                <td v-for="(playlist) in day.playlists" :class="{done: isDone(playlist)}">{{getName(playlist)}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';
    import {scheduleService} from '../services/StudyScheduleService';
    import Schedule from "../model/Schedule";

    export default {
        name: 'Home',
        props: {
            msg: String
        },
        mounted: function () {
            const self = this;
            scheduleService.getPlaylists().then(it => {
                self.playlists = it;
                this._calculateDays();
            });


        },
        data: function () {
            return {
                days: [],
                playlists: []
            };
        },
        methods: {
            formatDate(d) {
                return moment(d).format('dddd DD MMM YYYY');
            },
            isDone(playlist) {
                return playlist && playlist.done;
            },
            getName(playlist) {
                return (playlist || {name: ''}).name;
            },
            realDate(s) {
                return moment(s).format('dddd DD MMM YYYY');
            },
            _calculateDays() {
                let schedule = new Schedule(this.playlists);
                this.days = schedule.days;


            },

            /**
             *
             * @param playlists
             * @return time {*|moment.Moment}
             * @private
             */
            _findEarliestStudytime(playlists) {
                let min = moment();
                for (let i = 0; i < playlists.length; i++) {
                    let studyMoments = playlists[i].studyMoments;
                    for (let k = 0; k < studyMoments.length; k++) {
                        let studyMoment = studyMoments[k].time;
                        if (studyMoment.isBefore(min)) {
                            min = studyMoment;
                        }
                    }
                }

                return min;
            }
        }
    }
</script>

<style scoped>

    td {
        padding: 0.5em 1em 0.5em 1em;
        border: 1px solid gray;
    }
    td.done {
      background-color: green;
    }
</style>
