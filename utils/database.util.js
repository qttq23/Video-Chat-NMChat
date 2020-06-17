const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    // connectionLimit: 100,
    // host: 'bh1qqiz4n9xynvm2tzc8-mysql.services.clever-cloud.com',
    // port: 3306,
    // user: 'utgf1so6lfjyclgm',
    // password: '2XuYsIrCQWUOsQ4zt43B',
    // database: 'bh1qqiz4n9xynvm2tzc8',
    // insecureAuth: true
    connectionLimit: 100,
    host: 'us-cdbr-east-06.cleardb.net',
    port: 3306,
    user: 'bd675f7cf2908b',
    password: 'ead6a19d',
    database: 'heroku_d47afd14e19567f',
    insecureAuth: true
});

const pool_query = util.promisify(pool.query).bind(pool);

module.exports = {
    // query: async(sql) => pool_query(sql).then(value => {console.log(value); return value[0]}),
    query: (sql) => {return pool_query(sql);}
};