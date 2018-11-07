<template>
    <div>
        <h1>Import</h1>

        <div class="mdl-textfield mdl-js-textfield">
            <textarea v-model="csv" class="mdl-textfield__input" rows="100" id="csvImport"></textarea>
            <label class="mdl-textfield__label" for="csvImport">Playlists</label>
        </div>

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