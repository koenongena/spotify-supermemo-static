export default class Study {
    id: string;
    iteration: number;
    date: Date;
    playlist: string;
    done: boolean;
    spotifyPlaylistId?: string;
    constructor(id:string, date:Date, playlist:string, spotifyPlaylistId?: string, iteration = 0, done = false) {
        this.id = id;
        this.iteration = iteration;
        this.date = date;
        this.playlist = playlist;
        this.done = done;
        this.spotifyPlaylistId = spotifyPlaylistId;
    }

    static parse(json:any) {
        return new Study(
            json.id,
            new Date(json.date.toMillis()),
            json.playlist,
            json.spotifyPlaylistId || null,
            json.iteration,
            json.done,
        );
    }
}