import moment from 'moment';
import {Playlist} from "@/model/Playlist";

const addDays = function (date:Date, days:number) {
    var newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);
    return newDate;
};

export default class Schedule {
    playlists: Playlist[];
    days: any[];
    minDay: Date;
    maxDay: Date;
    /**
     *
     * @param playlists {Array.<Playlist>>}
     */
    constructor(playlists:Playlist[]) {
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
        let dayAfterLastDay = addDays(this.maxDay, 1);

        class StudyDay {
            date: Date;
            playlists: any[];


            constructor(date: Date, playlists: any[]) {
                this.date = date;
                this.playlists = playlists;
            }
        }

        while (day.getTime() < dayAfterLastDay.getTime()) {
            days.push(new StudyDay(day, [null, null, null, null, null, null, null]));
            day = addDays(day, 1);
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
    static _findEarliestStudytime(playlists:Playlist[]) {
        const compare = function (studyMoment:Date, min:Date) {
            return studyMoment.getTime() < min.getTime();
        };

        return Schedule._find(playlists, compare);
    }


    static _find(playlists:Playlist[], compare: (studyMoment:Date, m:Date) => boolean, start = new Date()) {
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

    static _findLastStudytime(playlists:Playlist[]) {
        const compare = function (studyMoment:Date, current:Date) {
            return moment(studyMoment).isAfter(moment(current));
        };

        return Schedule._find(playlists, compare, moment('1990-01-01').toDate());
    }
}