const moment = require('moment');
moment.locale('vi');


module.exports = {
    now: () => {
        return moment().format('Y-MM-D hh:mm:ss');
    },

    dmyConvert: (datetime) => {

        return moment(datetime).format('D/M/Y');
    },

    datetimeConvert: (datetime) => {
        return moment(datetime).format('Y-MM-D hh:mm:ss');
    }

}

