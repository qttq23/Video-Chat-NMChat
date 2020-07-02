// const moment = require('moment');
const moment = require('moment-timezone');
// moment.locale('vi');


module.exports = {
    now: () => {
        return moment().tz('Asia/Ho_Chi_Minh').format('Y-MM-D hh:mm:ss');
    },

    dmyConvert: (datetime) => {

        return moment(datetime).tz('Asia/Ho_Chi_Minh').format('D/M/Y');
    },

    datetimeConvert: (datetime) => {
        return moment(datetime).format('Y-MM-D hh:mm:ss');
    }

}

