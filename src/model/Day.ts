export default class Day {
    readonly date: Date;
    readonly playlistNames: string[];
    /**
     *
     * @param date
     * @param playlistNames {Array.<String>}
     */
    constructor(date:Date, playlistNames:string[]) {
        this.date = date;
        this.playlistNames = playlistNames;
    }
}