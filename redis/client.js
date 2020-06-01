const redis = require("redis");
const multipleRedis = require("multiple-redis");
const logger = require("./logger.app");
const env = process.env;

/**
 * Redis client
 */
const client = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  password: env.REDIS_PASSWORD,
  socket_keepalive: env.SOCKET_KEEPALIVE
});

/**
 * Replication Redis Client
 */
const replica = redis.createClient({
  host: env.RP_REDIS_HOST,
  port: env.RP_REDIS_PORT,
  db: env.RP_REDIS_DB,
  password: env.RP_REDIS_PASSWORD,
  socket_keepalive: env.RP_SOCKET_KEEPALIVE
});

/**
 * Create Client for multiplication
 */
const multipleClient = multipleRedis.createClient([client, replica]);

module.exports = {
  /**
   * get status about redis connection
   * @param {*} callback
   */
  connect: function() {
    logger.info(`db - ${env.REDIS_DB} creating connection on Redis ...`);
    client.on("error", function(err) {
      logger.warn(`Redis Connection Failed`);
    });
    client.on("connect", function(err) {
      logger.info(`Redis connected to db - ${env.REDIS_DB}`);
    });
    logger.info(`db - ${env.RP_REDIS_DB} creating connection on Redis Replica ...`);
    replica.on("error", function(err) {
      logger.warn(`Replica Redis Connection Failed`);
    });
    replica.on("connect", function(err) {
      logger.info(`Replica Redis connected to db - ${env.RP_REDIS_DB}`);
    });
  },

  /**
   * Set data on redis
   * @param {*} key
   * @param {*} value
   * @param {*} callback
   */
  set: function(key, value, callback) {
    multipleClient.set(key, value, callback);
  },

  /**
   * Get data from redis
   * @param {*} key
   * @param {*} callback
   */
  get: function(key, callback) {
    multipleClient.get(key, callback);
  },

  /**
   * Delete data from redis
   * @param {*} key
   * @param {*} callback
   */
  del: function(key, callback) {
    multipleClient.del(key, callback);
  }
};
