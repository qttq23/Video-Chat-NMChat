// const config = require('../config.json');

// console.log(config.Num);
// console.log(config.num);
// console.log(config.theme);

const db = require('../utils/database.util');
const converter = require('../utils/DatetimeConverter');


async function doSth(){
    const result = await db.query(`select * from rooms where RoomName="xxx"`);
    let room = result[0];
    console.log(room);

    console.log(converter.datetimeConvert(room.StartTime));

    // var day = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // console.log(day);

    // var now = moment().format('Y-MM-D hh:mm:ss');
    console.log(converter.now());
}

doSth();



