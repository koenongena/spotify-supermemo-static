import firebase from 'firebase';
import moment from "moment";
import {Playlist} from "../model/Playlist";

class StudyScheduleService {

    constructor() {
        this._db = null;
        this._log = window.console;

    }

    /**
     *
     * @param date {Date}
     * @returns {Promise<void | never>}
     */
    create(date) {
        let startOfTheDay = moment(date).startOf('day');
        let playlistName = startOfTheDay.format("YYYY-MM-DD");

        let createStudyMoment = function (date, additionalDays = 0) {
            let timestamp = date.clone().add(additionalDays, 'days');
            let done = false;
            let id = timestamp.format("YYYY-MM-DD") + "__" + playlistName;
            return {date: timestamp.toDate(), done: done, id: id, playlist: playlistName}
        };

        let sm = [
            createStudyMoment(startOfTheDay),
            createStudyMoment(startOfTheDay, 2),
            createStudyMoment(startOfTheDay, 10),
            createStudyMoment(startOfTheDay, 30),
            createStudyMoment(startOfTheDay, 60),
            createStudyMoment(startOfTheDay, 120),
            createStudyMoment(startOfTheDay, 240),
        ];

        const self = this;
        return Promise.all(sm.map(studyMoment => {
            return self.studiesTable
                .doc(studyMoment.id)
                .set(studyMoment)

        })).then(() => playlistName);
    }

    getTodoList() {
        return this.studiesTable
            .where("done", "==", false)
            .where("date", "<=", new Date())
            .get()
            .then(docs => {
                let studies = [];
                docs.forEach((doc) => studies.push(doc.data()));
                return studies;
            });
    }

    getPlaylists(filter = function () {
        return true
    }) {
        return this.db.collection("playlists").get().then((p) => {
            let playlists = [];
            p.forEach(doc => {
                if (filter(doc)) {
                    playlists.push(new Playlist(doc.data()));
                }
            });
            return playlists;
        });

    }

    setDone(playlistName) {
        return this.playlistsTable
            .where("name", "==", playlistName)
            .get()
            .then(response => alert(response));
    }

    setPending(playlistName) {
        return this.playlistsTable
            .where("name", "==", playlistName)
            .get()
            .then(response => alert(response));
    }

    get playlistsTable() {
        return this.db.collection("playlists");
    }

    get studiesTable() {
        return this.db.collection("studies");
    }

    get db() {
        if (this._db === null) {
            this._db = firebase.firestore();
            this._db.settings({
                timestampsInSnapshots: true
            });
        }
        return this._db.collection("users").doc(firebase.auth().currentUser.uid);
    }
}

let scheduleService = new StudyScheduleService();

export {scheduleService};