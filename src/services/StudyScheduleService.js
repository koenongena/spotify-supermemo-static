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

        let createStudymoment = function (date, additionalDays = 0) {
            let timestamp = date.clone().add(additionalDays, 'days');
            let done = false;
            return {time: timestamp.toDate(), done: done}
        };

        return this.db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("playlists")
            .doc(playlistName)
            .set({
                name: playlistName,
                studyMoments: [
                    createStudymoment(startOfTheDay),
                    createStudymoment(startOfTheDay, 2),
                    createStudymoment(startOfTheDay, 10),
                    createStudymoment(startOfTheDay, 30),
                    createStudymoment(startOfTheDay, 60),
                    createStudymoment(startOfTheDay, 120),
                    createStudymoment(startOfTheDay, 240),
                ]
            })
            .then(() => playlistName);
    }

    getPendingPlaylists() {
        let filter = function (doc) {
            const notYetDone = it => moment(it.time.toDate()).isBefore(moment()) && !it.done;
            return doc.data().studyMoments.some(notYetDone)
        };

        return this.getPlaylists(filter);
    }

    getPlaylists(filter = function(){ return true}) {
        return this.db.collection("users").doc(firebase.auth().currentUser.uid).collection("playlists").get().then((p) => {
            let playlists = [];
            p.forEach(doc => {
                if (filter(doc)) {
                    playlists.push(new Playlist(doc.data()));
                }
            });
            return playlists;
        });

    }

    get db() {
        if (this._db === null) {
            this._db = firebase.firestore();
            this._db.settings({
                timestampsInSnapshots: true
            });
        }
        return this._db;
    }
}

let scheduleService = new StudyScheduleService();

export {scheduleService};