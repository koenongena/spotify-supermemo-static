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
            return new Study(id, timestamp.toDate(), playlistName, iteration);
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
                .set(JSON.parse(JSON.stringify(studyMoment)))

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
        return this.studiesTable.get().then((docs) => {
            let studies = [];
            docs.forEach((doc) => {
                studies.push(Study.parse(doc.data()));
            });

            return groupByDate(studies);
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