let log4js = require("log4js");
let levels = require("log4js/lib/levels.js").levels;
let config = require("../../config/log4js.config.js");

let console, system, application, access;

log4js.configure(config);

console = log4js.getLogger();
system = log4js.getLogger("system");

let ApplicationLogger = function () {
  this.logger = log4js.getLogger("application");
};
let proto = ApplicationLogger.prototype;
for (let level of levels) {
  level = (level.levelStr || "").toLowerCase();
  proto[level] = (function (level) {
    return function (key, message) {
      let logger = this.logger;
      logger.addContext("key", key);
      logger[level](message);
    };
  })(level);
}
application = new ApplicationLogger();

access = log4js.getLogger("access");

module.exports = {
  console,
  system,
  application,
  access
};