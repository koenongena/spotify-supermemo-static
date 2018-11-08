export default class Study {
    constructor(id, date, playlist, iteration = 0, done = false) {
        this.id = id;
        this.iteration = iteration;
        this.date = date;
        this.playlist = playlist;
        this.done = done;
    }

    static parse(json) {
        return new Study(
            json.id,
            new Date(json.date.toMillis()),
            json.playlist,
            json.iteration,
            json.done
        );
    }
}