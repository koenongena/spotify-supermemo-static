import firebase from "firebase";
import SpotifyTrack from "../model/SpotifyTrack";

class BufferService {

    constructor() {
        this._db = null;
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

    get bufferTable() {
        return this.db.collection("buffer");
    }

    addToBuffer(songs) {
        const self = this;
        return Promise.all(songs.map(song => {
            return self.bufferTable
                .doc(song.id)
                .set({
                    id: song.id,
                    artist: song.artist,
                    title: song.title,
                    uri: song.uri,
                    weight: song.weight
                })
        }));
    }

    deleteFromBuffer(songs) {
        const self = this;
        songs.forEach((song) => {
            self.bufferTable
                .where("id", "==", song.id)
                .get().then(docs => {
                docs.forEach(doc => {
                    doc.ref.delete();
                })
            });
        });

    }

    getBuffer() {
        return this.bufferTable
            .orderBy("weight", "desc")
            .get()
            .then((docs) => {
                let songs = [];
                docs.forEach((doc) => {
                    let d = doc.data();
                    songs.push(new SpotifyTrack(
                        d.id,
                        "-",
                        d.artist,
                        d.title,
                        d.uri,
                        d.weight
                    ));
                });

                return songs;
            });
    }
}

let bufferService = new BufferService();

export {bufferService};