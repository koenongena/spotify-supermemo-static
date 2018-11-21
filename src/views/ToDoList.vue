<template>
    <div>
        <to-do-list-item v-for="(studyMoment, index) in studyMoments"
                :key="index"
                :studymoment="studyMoment"
                @done="handleDone(studyMoment)"></to-do-list-item>
    </div>
</template>

<script>
    import ToDoListItem from "./ToDoListItem";

    export default {
        name: "ToDoList",
        components: {ToDoListItem},
        props: {
            studyMoments: {default: []}
        },
        methods: {
            handleDone(study) {
                this.studyMoments = this.studyMoments.filter(sm => sm.id !== study.id);
            }
        }
    }
</script>
