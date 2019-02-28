class Playlist {
    readonly name: string;
    studyMoments: StudyMoment[];

    constructor(data:any){
        this.name = data.name;
        this.studyMoments = data.studyMoments.map((it:any) => new StudyMoment(it.time, it.done));
    }

    getFirstStudyMoment(){
        return this.studyMoments[0]
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

export {Playlist, StudyMoment}