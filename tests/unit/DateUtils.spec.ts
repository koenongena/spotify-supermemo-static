import DateUtils from "../../src/views/DateUtils";
import moment from "moment";

describe('DateUtils', () => {
    it('Add 2 days', () => {
        let firstDate = new Date(2018, DateUtils.OCTOBER, 25);
        let secondDay = moment(firstDate).add(2, 'days').toDate();

        expect(secondDay.getDate()).toEqual(new Date(2018, DateUtils.OCTOBER, 27).getDate());

    });

    it('Do it all', () => {

        let firstDate = new Date(2018, DateUtils.OCTOBER, 25);

        expect(moment(firstDate).add(2, 'days').toDate()).toEqual(new Date(2018, DateUtils.OCTOBER, 27));
        expect(moment(firstDate).add(10, 'days').toDate()).toEqual(new Date(2018, DateUtils.NOVEMBER, 4));
        expect(moment(firstDate).add(30, 'days').toDate()).toEqual(new Date(2018, DateUtils.NOVEMBER, 24));
        expect(moment(firstDate).add(60, 'days').toDate()).toEqual(new Date(2018, DateUtils.DECEMBER, 24));
        expect(moment(firstDate).add(120, 'days').toDate()).toEqual(new Date(2019, DateUtils.FEBRUARY, 22));
        expect(moment(firstDate).add(240, 'days').toDate()).toEqual(moment(new Date(2019, DateUtils.FEBRUARY, 22)).add(120, 'days').toDate());
        // expect(DateUtils.addDays(firstDate, 60)).toEqual(new Date(2019, DateUtils.FEBRUARY, 22));
        // expect(DateUtils.addDays(firstDate, 120)).toEqual(new Date(2019, DateUtils.FEBRUARY, 22));

    });
});