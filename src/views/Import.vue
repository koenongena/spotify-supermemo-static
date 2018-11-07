<template>
    <div>
        <h1>Import</h1>

        <textarea v-model="csv"></textarea>
        <button @click="startImport">Import</button>
    </div>
</template>

<script>
    import {scheduleService} from '../services/StudyScheduleService';
    import moment from 'moment';

    export default {
        name: "Import"
        ,
        data() {
            return {
                csv: "",
                log: window.console
            }
        },

        methods: {
            startImport(){
                const self = this;

                const lines = this.csv.split('\n');
                for(let i = 0; i < lines.length; i++){
                    if ((lines[i] || "").trim().length > 0) {
                        scheduleService.create(moment(lines[i].trim()))
                            .then((playlistName) => self.log.debug("Playlist " + playlistName + " added successfully"))
                            .catch((error) => self.log.error(error))
                    }
                }



            }
        }

    }
</script>

<style scoped>

</style>