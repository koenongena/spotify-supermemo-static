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
        this.time = moment(time.toMillis()).startOf('day');
        this.done = done;
    }
}

export {Playlist, StudyMoment}