const db = require('../utils/database.util');

module.exports = {
    all: _ => db.query(`call get_join_history_all()`),
    add: join => db.query(`call add_join_history(${join})`),
    get_user_by_id: userId => db.query(`call get_join_history_by_id("${userId}")`),
    remove: (userId,roomId) => db.query(`call remove_join_history("${userId}","${roomId}")`),
}