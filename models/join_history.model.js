const db = require('../utils/database.util');

module.exports = {
    all: isCurrent => db.query(`call get_join_history_all(${isCurrent})`),
    update: (userId, roomId, joinTime, leaveTime) => db.query(`call update_join_history_leave_time("${userId}","${roomId}","${leaveTime}")`),
    add: (userId, roomId, joinTime, leaveTime) => db.query(`call add_join_history("${userId}","${roomId}","${joinTime}","${leaveTime}")`),
    get_user_by_id: userId => db.query(`call get_join_history_by_id("${userId}")`).then(result => result[0]),
    get_by_rooom_id: roomId => db.query(`call get_join_history_by_room_id("${roomId}")`).then(result => result[0]),
    remove: (userId, roomId) => db.query(`call remove_join_history("${userId}","${roomId}")`),
}