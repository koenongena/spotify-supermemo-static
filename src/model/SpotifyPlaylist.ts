export default class SpotifyPlaylist {
    readonly id: string;
    readonly name: string;
    readonly tracks: any[];
    readonly scanned: boolean;
    readonly uri: string;
    readonly weight: number;
    readonly restudy: boolean;
    readonly weightedByPopularity: boolean;

    constructor(json:any){
        this.id = json.id;
        this.name = json.name;
        this.tracks = json.tracks;
        this.scanned = json.scanned;
        this.uri = json.uri;
        this.weightedByPopularity = json.weight == 'by-popularity';
        if (this.weightedByPopularity) {
            this.weight = 0;
        } else {
            this.weight = json.weight || 0;
        }
        this.restudy = json.restudy || false
    }
}