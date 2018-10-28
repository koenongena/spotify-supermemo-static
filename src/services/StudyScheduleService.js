import firebase from 'firebase';
import moment from "moment";

class StudyScheduleService {

    constructor() {
        this._db = null;
    }

    /**
     *
     * @param date {Date}
     * @returns {Promise<void | never>}
     */
    create(date) {
        let startOfTheDay = moment(date).startOf('day');
        let playlistName = startOfTheDay.format("YYYY-MM-DD");

        const Console = window.console;

        return this.db.collection("playlists")
            .doc(playlistName)
            .set({
                name: playlistName,
                studyMoments: [
                    {time: date, done: true},
                    {time: startOfTheDay.add(2, 'days').toDate(), done: false},
                    {time: startOfTheDay.add(10, 'days').toDate(), done: false},
                    {time: startOfTheDay.add(30, 'days').toDate(), done: false},
                    {time: startOfTheDay.add(60, 'days').toDate(), done: false},
                    {time: startOfTheDay.add(120, 'days').toDate(), done: false},
                ]
            }).then(() => Console.log("Playlist " + playlistName + " added successfully"))
            .catch((error) => Console.error(error))

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