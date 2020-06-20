const model = require('../models/user.model');
const roomModel = require('../models/room.model');

// console.log((async() => await model.update_user(
//     "63b1255c-88dc-4710-a314-770188709995",
//     "Tran Thuan Thanh",
//     "tranthu123@gmail.com",
//     "",
//     "1995-03-16 00:00:00",
//     "013123123222"))());
// console.log((async() => await model.add(
//     "63b1255c-88dc-4710-a314-770188709916",
//     "Tran Thuan Thanh",
//     "tranthu123@gmail.com",
//     "123",
//     "",
//     "1995-03-16 00:00:00",
//     "013123123222"))());

// console.log((async() => await roomModel.add(
//     "63b1255c-88dc-4710-a314-770188709917",
//     "Tran Thuan Thanh",
//     "63b1255c-88dc-4710-a314-770188709995",
//     "1995-03-16 00:00:00",
//     ""))());



// console.log((async() => await roomModel.add(
//         "63b1255c-88dc-4710-a314-770188709917",
//         "Tran Thuan Thanh",
//         "63b1255c-88dc-4710-a314-770188709995",
//         "1995-03-16 00:00:00",
//         ""))());


console.log((async() => await roomModel.update_room_end_time(
    "06711889-771b-43c8-8ac7-4ee08a33fde6",
    "0ed165cf-ac95-4da4-8a65-54d8ea99719b",
    "2020-06-16 18:05:13"))());


//CALL update_room_end_time(,"0ed165cf-ac95-4da4-8a65-54d8ea99719b","2020-06-16 18:05:13");