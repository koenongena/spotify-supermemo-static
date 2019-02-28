export default class SpotifyTrack {
    readonly id: string;
    readonly playlist: string;
    readonly artist: string;
    readonly title: string;
    readonly uri: string;
    weight: number;

    constructor(id:string, playlist:string = "?", artist:string, title:string, uri = '', weight = 0) {
        this.id = id;
        this.playlist = playlist;
        this.artist = artist;
        this.title = title;
        this.uri = uri;
        this.weight = weight;
    }
}