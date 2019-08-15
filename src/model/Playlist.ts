class Playlist {
    readonly name: string;
    studyMoments: StudyMoment[];

    constructor(data:any){
        this.name = data.name;
        this.studyMoments = data.studyMoments.map((it:any) => new StudyMoment(it.time, it.done));
    }
}

class StudyMoment {
    time: Date;
    done: boolean;

    constructor(time:any, done:boolean) {
        this.time = new Date(time.toMillis());
        this.done = done;
    }
}

export type CreateSpotifyPlaylistResponse = {
    id: string;
    uri:string;
}

export {Playlist, StudyMoment}