const mysql = require('mysql');
const util = require('util');


const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'www.db4free.net',
  user: 'aramendi',
  port: 3307,
  password: '22552994',
  database: 'interoperables',
})
/*const pool = mysql.createPool({
  connectionLimit: 100,

  //connectTimeout  : 60 * 60 * 1000,
  //aquireTimeout   : 60 * 60 * 1000,
  //timeout         : 60 * 60 * 1000,
  //host: '190.170.122.7',
  //host: 'curriculum.bc.uc.edu.ve',
  host: 'higgs.bc.uc.edu.ve',
  //host: 'admin.higgs.bc.uc.edu.ve',
  //port: 2222,
  database: 'curriculum',
  user: 'curriculum',
  password: 'CBuc7rr@',
  //debug: true
  //method: 'POST'
})*/

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  if (connection) connection.release()
  return
})

pool.query = util.promisify(pool.query);

module.exports = pool;
