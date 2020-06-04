const userModel = require('./models/user.model.js');

let result = userModel.get_user_by_id("0ed165cf-ac95-4da4-8a65-54d8asdsadea99719b");

console.log(1);

(async() => console.log(await result))();