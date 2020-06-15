const model = require('./models/user.model');
const roomModel = require('./models/room.model');

// console.log((async() => await model.update_user(
//     "63b1255c-88dc-4710-a314-770188709995",
//     "Tran Thuan Thanh",
//     "tranthu123@gmail.com",
//     "",
//     "1995-03-16 00:00:00",
//     "013123123222"))());
console.log((async() => await model.add(
    "63b1255c-88dc-4710-a314-770188709916",
    "Tran Thuan Thanh",
    "tranthu123@gmail.com",
    "123",
    "",
    "1995-03-16 00:00:00",
    "013123123222"))());

console.log((async() => await roomModel.add(
    "63b1255c-88dc-4710-a314-770188709916",
    "Tran Thuan Thanh",
    "63b1255c-88dc-4710-a314-770188709995",
    "1995-03-16 00:00:00",
    ""))());