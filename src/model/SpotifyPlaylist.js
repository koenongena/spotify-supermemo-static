export default class SpotifyPlaylist {
    constructor(json){
        this.id = json.id;
        this.name = json.name;
        this.tracks = json.tracks;
        this.uri = json.uri;
    }
}