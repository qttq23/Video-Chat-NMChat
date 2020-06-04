const db = require('../utils/database.util');

module.exports = {
    all: isCurrent => db.query(`call get_room_all(${isCurrent})`),
    add: (room) => db.query(`call add_room("${room}")`),
    remove: (roomId) => db.query(`call remove_room("${userId}","${friendId}")`),
    get_room_by_id: (userId, isCurrent) => db.query(`call get_room_by_id("${userId}","${isCurrent}")`).then(result => result[0]),
    get_room_by_host_id: (userId, isCurrent) => db.query(`call get_room_by_host_id("${userId}","${isCurrent}")`).then(result => result[0]),
}