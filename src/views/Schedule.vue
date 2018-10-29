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
                <td>{{realDate(day.name)}}</td>
                <td>{{day.studyMoment6}}</td>
                <td>{{day.studyMoment5}}</td>
                <td>{{day.studyMoment4}}</td>
                <td>{{day.studyMoment3}}</td>
                <td>{{day.studyMoment2}}</td>
                <td>{{day.studyMoment1}}</td>
                <td>{{day.studyMoment0}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';
    import {scheduleService} from '../services/StudyScheduleService';

    export default {
        name: 'Home',
        props: {
            msg: String
        },
        mounted: function () {
            const self = this;
            scheduleService.getPlaylists().then(it => {
                self.playlists = it;
            });
        },
        data: function () {
            return {
                days: [],
            };
        },
        methods: {
            realDate(s) {
                return moment(s).format('dddd DD MMM YYYY');
            }
        }
    }
</script>

<style scoped>

</style>
