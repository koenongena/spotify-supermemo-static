export default class SpotifyTrack {

    constructor(id, playlist = "?", artist, title, uri = '') {
        this.id = id;
        this.playlist = playlist;
        this.artist = artist;
        this.title = title;
        this.uri = uri;
    }
}