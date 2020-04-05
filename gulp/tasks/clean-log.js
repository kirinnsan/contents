let config = require("../config.js");
let del = require("del");
let clean;

clean = async function () {
  await del("./**/*", { cwd: config.path.log });
};

module.exports = clean;
