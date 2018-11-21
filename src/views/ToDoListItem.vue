<template>
    <div>
            <span>
             {{studymoment.playlist}}
            </span>
        <div v-if="loading">...</div>
        <a v-else href="#!" @click.stop.prevent="setDone()"><i class="material-icons">done</i></a>
    </div>
</template>

<script>
    import {scheduleService} from '../services/StudyScheduleService';

    export default {
        name: "ToDoListItem",
        props: {
            studymoment: null
        },
        data() {
            return {
                loading: false
            }
        },
        methods: {
            setDone() {
                const self = this;
                this.loading = true;
                const doneHandler = function () {
                    this.loading = false;
                    self.$emit("done", self.studymoment)
                }.bind(this);

                scheduleService.setDone(self.studymoment)
                    .then(() => doneHandler());
            }
        }
    }
</script>