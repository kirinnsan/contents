let config = require("../config.js");
let { src, dest, series } = require("gulp");
let del = require("del");
// let uglify = require("gulp-uglify");
let uglify = require("gulp-uglify-es").default;
let clean, minify;

clean = async function () {
  await del("./javascripts/**/*", { cwd: config.path.output });
};

minify = function () {
  return src("./javascripts/**/*", { cwd: config.path.input })
    .pipe(uglify(config.uglify))
    .pipe(dest("./javascripts", { cwd: config.path.output }));
};

module.exports = series(clean, minify);