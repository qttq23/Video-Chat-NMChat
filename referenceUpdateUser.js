const model = require('./models/user.model');

console.log((async() => await model.update_user(
    "63b1255c-88dc-4710-a314-770188709995",
    "Tran Thuan Thanh",
    "tranthu123@gmail.com",
    "",
    "1995-03-16 00:00:00",
    "013123123222"))());