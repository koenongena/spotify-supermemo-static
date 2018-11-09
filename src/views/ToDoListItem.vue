<template>
    <div class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <!--<i class="material-icons mdl-list__item-avatar">person</i>-->
             {{studymoment.playlist}}
            </span>
        <div v-if="loading">...</div>
        <a v-else class="mdl-list__item-secondary-action" href="#!" @click.stop.prevent="setDone()"><i class="material-icons">done</i></a>
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

<style scoped>
    .to-do-list {
        max-width: 12em;
    }
</style>