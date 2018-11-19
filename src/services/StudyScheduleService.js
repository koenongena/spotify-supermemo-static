import firebase from 'firebase';
import moment from "moment";
import Study from "../model/Study";

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

        let createStudy = function (iteration = 0, date, additionalDays = 0) {
            let timestamp = date.clone().add(additionalDays, 'days');
            let id = timestamp.format("YYYY-MM-DD") + "__" + playlistName;
            let done = false;
            return new Study(id, timestamp.toDate(), playlistName, iteration, done);
        };

        let sm = [
            createStudy(0, startOfTheDay),
            createStudy(1, startOfTheDay, 2),
            createStudy(2, startOfTheDay, 10),
            createStudy(3, startOfTheDay, 30),
            createStudy(4, startOfTheDay, 60),
            createStudy(5, startOfTheDay, 120),
            createStudy(6, startOfTheDay, 240),
        ];

        const self = this;
        return Promise.all(sm.map(studyMoment => {
            return self.studiesTable
                .doc(studyMoment.id)
                .set({
                    id: studyMoment.id,
                    date: studyMoment.date,
                    iteration: studyMoment.iteration,
                    playlist: studyMoment.playlist,
                    done: studyMoment.done
                })
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

    getDays() {
        let groupByDate = function (studies) {
            const days = studies.reduce(function (acc, s) {
                const p = moment(s.date).format("YYYY-MM-DD");
                if (!acc[0].hasOwnProperty(p)) acc[0][p] = [];
                acc[0][p].push(s);
                return acc;
            }, [{}])
                .reduce(function (acc, v) {
                    Object.keys(v).forEach(function (k) {
                        acc.push({date: k, studyMoments: v[k]})
                    });
                    return acc;
                }, []);

            return days;
        };
        return this.studiesTable.where("date", ">=", moment().add(-30, 'days').toDate()).get().then((docs) => {
            let studies = [];
            docs.forEach((doc) => {
                studies.push(Study.parse(doc.data()));
            });

            return groupByDate(studies);
        });

    }

    /**
     *
     * @param study {Study}
     * @returns {Promise<void | never>}
     */
    setDone(study) {
        this._log.debug("Setting ", study.id + " to done");

        return this.studiesTable
            .doc(study.id)
            .update({done: true});
    }

    setPending(study) {
        this._log.debug("Setting ", study.id + " to pending");

        return this.studiesTable
            .doc(study.id)
            .update({done: false});
    }

    deletePlaylist(playlistName) {
        return this.studiesTable
            .where("playlist", "==", playlistName)
            .get().then(docs => {
                docs.forEach(doc => {
                    doc.ref.delete();
                })
            });

    }

    get studiesTable() {
        return this.db.collection("studies");
    }

    get tracksTable() {
        return this.db.collection("tracks");
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

    /**
     *
     * @param track {SpotifyTrack}
     */
    saveTrack(track) {
        this.tracksTable.doc(track.id)
            .set({
                id: track.id,
                artist: track.artist,
                title: track.title,
                playlist: track.playlist
            })
    }
}

let scheduleService = new StudyScheduleService();

export {scheduleService};