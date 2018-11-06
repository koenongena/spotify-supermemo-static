import moment from 'moment';

export default class Schedule {
    /**
     *
     * @param playlists {Array.<Playlist>>}
     */
    constructor(/*Array of Playlist*/ playlists) {
        this.playlists = playlists;
        this.days = [];
        this.minDay = Schedule._findEarliestStudytime(this.playlists);
        this.maxDay = Schedule._findLastStudytime(this.playlists);

        this.days = this._calculateDays();
    }

    /**
     * Calculate the days
     *
     * @private
     */
    _calculateDays() {
        if (this.playlists.length === 0) {
            return [];
        }
        let days = [];
        let day = this.minDay;
        while (day.isBefore(this.maxDay.add(1, 'days'))) {
            days.push({
                date: moment(day),
                studyMoment0: null,
                studyMoment1: null,
                studyMoment2: null,
                studyMoment3: null,
                studyMoment4: null,
                studyMoment5: null,
                studyMoment6: null,
            });
            day = day.add(1, 'days');
        }

        return days;
    }

    /**
     *
     * @param playlists
     * @return time {*|moment.Moment}
     * @private
     */
    static _findEarliestStudytime(playlists) {
        const compare = function (studyMoment, min) {
            return studyMoment.isBefore(min);
        };

        return Schedule._find(playlists, compare);
    }


    static _find(playlists, compare, start = moment()) {
        let m = start;
        for (let i = 0; i < playlists.length; i++) {
            let studyMoments = playlists[i].studyMoments;
            for (let k = 0; k < studyMoments.length; k++) {
                let studyMoment = studyMoments[k].time;
                if (compare(studyMoment, m)) {
                    m = studyMoment;
                }
            }
        }

        return m;
    }

    static _findLastStudytime(playlists) {
        const compare = function (studyMoment, current) {
            return studyMoment.isAfter(current);
        };

        return Schedule._find(playlists, compare, moment('1990-01-01'));
    }
}