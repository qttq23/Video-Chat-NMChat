const db = require('../utils/database.util');

module.exports = {
    all: _ => db.query(`call get_friend_all()`),
    add: (userId,friendId) => db.query(`call add_friend("${userId}","${friendId}")`),
    remove: (userId,friendId) => db.query(`call remove_friend("${userId}","${friendId}")`),
    get_friend_by_id: userId => db.query(`call get_friend_by_id("${userId}")`),
}