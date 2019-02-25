export default class SpotifyPlaylist {
    constructor(json){
        this.id = json.id;
        this.name = json.name;
        this.tracks = json.tracks;
        this.scanned = json.scanned;
        this.uri = json.uri;
        this.weight = json.weight || 0;
    }
}