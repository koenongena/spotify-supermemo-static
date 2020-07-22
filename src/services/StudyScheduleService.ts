import firebase from 'firebase';
import moment, {Moment} from "moment";
import Study from "../model/Study";
import SpotifyPlaylist from "../model/SpotifyPlaylist";
import SpotifyTrack from "@/model/SpotifyTrack";
import {Playlist} from "@/model/Playlist";
import {scanSpotifyPlaylist} from "@/store";

class StudyScheduleService {
    private _db: firebase.firestore.Firestore | null;
    private _log: Console;

    constructor() {
        this._db = null;
        this._log = window.console;

    }

    /**
     *
     * @param date {Date}
     * @returns {Promise<void | never>}
     */
    create(date: Date) {
        let startOfTheDay = moment(date).startOf('day');
        let playlistName = startOfTheDay.format("YYYY-MM-DD");

        let createStudy = function (iteration = 0, date: Moment, additionalDays = 0) {
            let timestamp = date.clone().add(additionalDays, 'days');
            let id = timestamp.format("YYYY-MM-DD") + "__" + playlistName;
            let done = false;
            return new Study(id, timestamp.toDate(), playlistName, iteration, done);
        };

        let sm: Study[] = [
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
            .then((docs: any) => {
                let studies:Study[] = [];
                docs.forEach((doc:any) => studies.push(Study.parse(doc.data())));
                return studies;
            });
    }

    getDays() {
        const groupByDate = function (studies: Study[]) {
            return studies.reduce(function (acc: any, s: any) {
                const p = moment(s.date).format("YYYY-MM-DD");
                if (!acc[0][p]) acc[0][p] = [];
                acc[0][p].push(s);
                return acc;
            }, [{}])
                .reduce(function (acc: any, v: any) {
                    Object.keys(v).forEach(function (k) {
                        acc.push({date: k, studyMoments: v[k]})
                    });
                    return acc;
                }, []);
        };

        return this.studiesTable.where("date", ">=", moment().add(-30, 'days').toDate()).get().then((docs) => {
            let studies: Study[] = [];
            docs.forEach((doc: any) => {
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
    async setDone(study: Study) {
        this._log.debug("Setting ", study.id + " to done");

        await this.studiesTable
            .doc(study.id)
            .update({done: true});

        const spotifyPlaylist: SpotifyPlaylist = await scheduleService.getPlaylistsWithName(study.playlist);

        if (!spotifyPlaylist.scanned) {
            await scanSpotifyPlaylist(spotifyPlaylist, (loading: boolean) => {
                this._log.debug('Set to loading: ', loading);
            });

        }
    }

    setPending(study: Study) {
        this._log.debug("Setting ", study.id + " to pending");

        return this.studiesTable
            .doc(study.id)
            .update({done: false});
    }

    deletePlaylist(playlistName: string) {
        return this.studiesTable
            .where("playlist", "==", playlistName)
            .get().then((docs: any) => {
                docs.forEach((doc: any) => {
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

    get bufferTable() {
        return this.db.collection("buffer");
    }

    get playlistsTable() {
        return this.db.collection("playlists");
    }

    get db() {
        if (this._db === null) {
            this._db = firebase.firestore();
        }
        return this._db.collection("users").doc(firebase.auth().currentUser!!.uid);
    }

    fetchUnscannedPlaylists() {
        return this.playlistsTable.where("scanned", "==", false).get()
            .then((docs) => {
                let playlists: SpotifyPlaylist[] = [];
                docs.forEach((doc) => {
                    let documentData = doc.data();
                    playlists.push(new SpotifyPlaylist(documentData));
                });

                return playlists;
            })
    }


    /**
     *
     * @param track {SpotifyTrack}
     */
    saveTrack(track: SpotifyTrack) {
        return this.tracksTable.doc(track.id)
            .set({
                id: track.id,
                artist: track.artist,
                title: track.title,
                playlist: track.playlist
            });
    }

    /**
     *
     * @param playlist {SpotifyPlaylist}
     */
    savePlaylist(playlist: SpotifyPlaylist) {
        return this.playlistsTable.doc(playlist.name)
            .set({
                id: playlist.id,
                name: playlist.name,
                uri: playlist.uri,
                scanned: playlist.scanned
            })
    }

    getTracksInTrackedPlaylists() {
        return this.db.collection("scanlist").get()
            .then((docs) => {
                let playlists: Playlist[] = [];
                docs.forEach(() => {

                });

                return playlists;
            });
    }

    getTrackedPlaylists(): Promise<SpotifyPlaylist[] | never> {
        return this.db.collection("scanlist").get()
            .then((docs) => {
                let playlists: SpotifyPlaylist[] = [];
                docs.forEach((doc) => {
                    let json = doc.data();
                    playlists.push(new SpotifyPlaylist(json))
                });
                return playlists;
            });
    }

    getBuffered(trackId: String) {
        return this.bufferTable
            .where("id", "==", trackId)
            .get()
            .then((docs) => {
                if (docs.size > 0) {
                    const d = docs.docs[0].data();
                    return new SpotifyTrack(
                        d.id,
                        "-",
                        d.artist,
                        d.title,
                        d.uri,
                        d.weight
                    )
                }

                return undefined;
            });
    }

    isStudied(track: SpotifyTrack) {
        return this.tracksTable
            .where("id", "==", track.id)
            .get()
            .then((docs) => docs.size === 0);

    }

    async getPlaylistsWithName(playlistName: string) {
        return this.playlistsTable
            .doc(playlistName)
            .get()
            .then((doc) => (!doc.exists ? new SpotifyPlaylist({}) : new SpotifyPlaylist(doc.data())));
    }
}

let scheduleService = new StudyScheduleService();

export {scheduleService};