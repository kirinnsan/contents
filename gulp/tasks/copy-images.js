let config = require("../config.js");
let { src, dest, series} = require("gulp");
let del = require("del");
let clean, copy;

clean = async function () {
  await del("./images/**/*", { cwd: config.path.output });
};

copy = function () {
  return src("./images/**/*", { cwd: config.path.input })
    .pipe(dest("./images", { cwd: config.path.output }));
};

module.exports = series(clean, copy);