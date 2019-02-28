import firebase from "firebase";
import SpotifyTrack from "../model/SpotifyTrack";

class BufferService {
    private _db: firebase.firestore.Firestore | undefined;

    constructor() {

    }


    get db() {
        if (this._db === undefined) {
            this._db = firebase.firestore();
            this._db.settings({
                timestampsInSnapshots: true
            });
        }
        // @ts-ignore
        return this._db.collection("users").doc(firebase.auth().currentUser.uid);
    }

    get bufferTable() {
        return this.db.collection("buffer");
    }

    addToBuffer(songs: SpotifyTrack[]) {
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

    deleteFromBuffer(songs:SpotifyTrack[]) {
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
                let songs:SpotifyTrack[] = [];
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