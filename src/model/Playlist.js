import moment from 'moment';

class Playlist {
    constructor(data){
        this.name = data.name;
        this.studyMoments = data.studyMoments.map(it => new StudyMoment(it.time, it.done));
    }

    getFirstStudyMoment(){
        return this.studyMoments[0]
    }
}

class StudyMoment {
    constructor(time, done) {
        this.time = new Date(time.toMillis());
        this.done = done;
    }
}

export {Playlist, StudyMoment}