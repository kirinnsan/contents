let log4js = require("log4js");
let logger = require("./logger.js").access;

module.exports = function (options) {
  options = options || {};
  options.level = options.level || "auto";
  return log4js.connectLogger(logger, options);
};