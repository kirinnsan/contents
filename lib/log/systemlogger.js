let logger = require("./logger.js").system;

module.exports = function (options) {
  return (err, req, res, next) => {
    logger.error(err.message);
    next(err);
  };
};