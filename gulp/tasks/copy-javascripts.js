let config = require("../config.js");
let { src, dest, series } = require("gulp");
let del = require("del");
let clean, copy;

clean = async function () {
  await del("./javascripts/**/*", { cwd: config.path.output });
};

copy = function () {
  return src("./javascripts/**/*", { cwd: config.path.input })
    .pipe(dest("./javascripts", { cwd: config.path.output }));
};

module.exports = series(clean, copy);