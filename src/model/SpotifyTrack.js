export default class SpotifyTrack {

    constructor(id) {
        this.id = id;
    }

    static parse(json) {
        return new SpotifyTrack(json.track.id)
    }
}