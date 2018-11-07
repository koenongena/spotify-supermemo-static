import Schedule from "../../src/model/Schedule";
import {Playlist} from "../../src/model/Playlist";
import {firestore} from "firebase";

function _createStudyMoment(sm0) {
    return {done: true, time: new firestore.Timestamp.fromDate(sm0)};
}

describe('Schedule', () => {
    it('No playlists', () => {
        let schedule = new Schedule([]);

        expect(schedule.days.length).toBe(0);
    });

    it('Single playlist, with one study moment', () => {
        let firstStudyMoment = new Date(2017, 1, 10, 0,0,0,0);
        let playlist = new Playlist({name: '2017-02-10', studyMoments: [_createStudyMoment(firstStudyMoment)]});
        let schedule = new Schedule([playlist]);

        expect(schedule.days.length).toBe(1);
        expect(schedule.days[0].date).toEqual(firstStudyMoment);
        expect(schedule.days[0].playlists).toEqual([null, null, null, null, null, null, '2017-02-10']);
    });
});