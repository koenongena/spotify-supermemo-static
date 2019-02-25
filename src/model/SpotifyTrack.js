export default class SpotifyTrack {

    constructor(id, playlist = "?", artist, title, uri = '', weight = 0) {
        this.id = id;
        this.playlist = playlist;
        this.artist = artist;
        this.title = title;
        this.uri = uri;
        this.weight = weight;
    }
}