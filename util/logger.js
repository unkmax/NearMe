module.exports = {
    /**
     * Loggin Info level
     * @param {*} message
     */
    info: function(message) {
      console.info(`\x1b[32m[INFO] ${new Date().toJSON()} ${message}\x1b[0m`);
    },
  
    /**
     * Loggin Debug level
     * @param {*} message
     */
    debug: function(message) {
      if (process.env.DEBUG == "true")
        console.debug(`\x1b[33m[DEBUG] ${new Date().toJSON()} ${message}\x1b[0m`);
    },
  
    /**
     * Loggin Warn level
     * @param {*} message
     */
    warn: function(message) {
      console.warn(`\x1b[36m[WARN] ${new Date().toJSON()} ${message}\x1b[0m`);
    },
  
    /**
     * Loggin Error level
     * @param {*} message
     */
    error: function(message) {
      console.error(
        `\x1b[31m[ERROR] ${new Date().toJSON()} ${message}\n${
          process.env.DEBUG == "true" ? new Error().stack : ""
        }\x1b[0m`
      );
    }
  };
  