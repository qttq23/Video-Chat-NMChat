const db = require('../utils/database.util');

module.exports = {
    all: _ => db.query(`call get_users_all()`),
    add: (userId, name, email, password, avatarUrl, birthday, phoneNumber) => {
        console.log(`call add_user("${userId}","${name}","${email}","${avatarUrl}","${birthday}","${phoneNumber}")`);
        db.query(`call add_user("${userId}","${name}","${email}","${password}","${avatarUrl}","${birthday}","${phoneNumber}")`)
    },
    update_user: (userId, name, email, avatarUrl, birthday, phoneNumber) => db.query(`call update_user("${userId}","${name}","${email}","${avatarUrl}","${birthday}","${phoneNumber}")`),
    get_user_by_id: userId => db.query(`call get_user_by_id("${userId}")`).then(result => result[0]),
    remove: userId => db.query(`call remove_user_by_id("${userId}")`),
    change_password: (userId, newPwd, oldPwd) => db.query(`call change_user_password("${userId}","${newPwd}","${oldPwd}")`),
    get_user_by_email: email => db.query(`call get_user_by_email("${email}")`).then(result => result[0])
}