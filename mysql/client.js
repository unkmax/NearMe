/**
 * Mysql Client
 */

const mysql = require("mysql");
const logger = require("./logger");
const env = process.env;
const dbconfig = {
  connectionLimit: env.MYSQL_POOL_SIZE,
  host: env.MYSQL_HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  port: env.MYSQL_PORT,
  multipleStatements: true,
};

let pool = mysql.createPool(dbconfig);;

module.exports = {

  /**
   * Check Can Connect to Database
   * @param {*} callback
   */
  connect: (callback) => {
    pool.getConnection((err, conn) => {
			if(err) {
				logger.warn("Mysql connection error");
				callback(true);
			} else {
				logger.info(`${env.MYSQL_DATABASE} connected`);
				callback(false);
			}
		});
  },

  /**
   * execute query
   * @param {*} sqlQuery
   * @param {*} callback
   */
  execute: (sqlQuery, callback) => {
    pool.getConnection((err, conn) => {
      if (err) {
        callback(false, null);
      } else {
        conn.query(sqlQuery, (err, result) => {
          callback(err, result);
				});
				conn.release();
      }
    });
  },

  executeWithData: (sqlQuery, data, callback) => {
    pool.getConnection((err, conn) => {
      if (err) {
        callback(false, null);
      } else {
        conn.query(sqlQuery, data, (err, result) => {
          callback(err, result);
				});
				conn.release();
      }
    });
  }
};
