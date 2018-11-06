import moment from 'moment';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

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
        let dayAfterLastDay = this.maxDay.addDays(1);
        while (day.getTime() < dayAfterLastDay.getTime()) {
            days.push({
                date: day,
                playlists: [null,null,null,null,null,null,null]
            });
            day = day.addDays(1);
        }

        for (let i = 0; i < this.playlists.length; i++) {
            const playlist = this.playlists[i];
            for (let j = 0; j < playlist.studyMoments.length; j++) {
                const studyMoment = playlist.studyMoments[j];
                let filteredDays = days.filter(it => it.date.getTime() === studyMoment.time.getTime());
                if (filteredDays.length) {
                    filteredDays[0].playlists[6 - j] = {name: playlist.name, done: studyMoment.done};
                }
            }
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
            return studyMoment.getTime() < min.getTime();
        };

        return Schedule._find(playlists, compare);
    }


    static _find(playlists, compare, start = new Date()) {
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
            return moment(studyMoment).isAfter(moment(current));
        };

        return Schedule._find(playlists, compare, moment('1990-01-01'));
    }
}