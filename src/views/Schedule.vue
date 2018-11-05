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
                <td>{{day.date}}</td>
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
            realDate(s) {
                return moment(s).format('dddd DD MMM YYYY');
            },
            _calculateDays(){
                let d = this._findEarliestStudytime(this.playlists);

                this.days = [];
                let tomorrow = moment().add(1, 'days');
                while (d.isBefore(tomorrow)) {
                    this.days.push({date: moment(d), studyMoment0: null, studyMoment1: null, studyMoment2: null, studyMoment3: null, studyMoment4: null, studyMoment5: null, studyMoment6: null, });
                    d = d.add(1, 'days');
                }


            },

            /**
             *
             * @param playlists
             * @return time {*|moment.Moment}
             * @private
             */
            _findEarliestStudytime(playlists) {
                let min = moment();
                for(let i = 0; i < playlists.length; i++){
                    let studyMoments = playlists[i].studyMoments;
                    for (let k = 0; k < studyMoments.length; k++){
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

</style>
