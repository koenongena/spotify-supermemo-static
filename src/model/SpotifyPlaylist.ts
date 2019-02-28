export default class SpotifyPlaylist {
    readonly id: string;
    readonly name: string;
    readonly tracks: any[];
    readonly scanned: boolean;
    readonly uri: string;
    readonly weight: number;

    constructor(json:any){
        this.id = json.id;
        this.name = json.name;
        this.tracks = json.tracks;
        this.scanned = json.scanned;
        this.uri = json.uri;
        this.weight = json.weight || 0;
    }
}