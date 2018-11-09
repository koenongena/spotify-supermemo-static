<template>
    <div class="to-do-list mdl-list">
        <to-do-list-item v-for="(studyMoment, index) in studyMoments"
                :key="index"
                :studymoment="studyMoment"
                @done="handleDone(studyMoment)"></to-do-list-item>
    </div>
</template>

<script>
    import {scheduleService} from '../services/StudyScheduleService';
    import ToDoListItem from "./ToDoListItem";

    export default {
        name: "ToDoList",
        components: {ToDoListItem},
        data() {
            return {
                studyMoments: []
            }
        },
        mounted: function () {
            const self = this;
            scheduleService.getTodoList().then(it => {
                self.studyMoments = it;
            });
        },
        methods: {
            handleDone(study) {
                this.studyMoments = this.studyMoments.filter(sm => sm.id !== study.id);
            }
        }
    }
</script>

<style scoped>
    .to-do-list {
        max-width: 12em;
        margin: 0 auto 0 auto
    }
</style>