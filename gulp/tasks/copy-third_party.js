let config = require("../config.js");
let { src, dest, series, parallel } = require("gulp");
let del = require("del");

let clean = async function () {
  await del("./third_party/**/*", { cwd: config.path.output });
};

let jquery = function () {
  return src("./jquery/dist/**/*", { cwd: config.path.node_modules })
    .pipe(dest("./third_party/jquery", { cwd: config.path.output }));
};

let popper = function () {
  return src("./popper.js/dist/**/*", { cwd: config.path.node_modules })
    .pipe(dest("./third_party/popper.js", { cwd: config.path.output }));
};

let bootstrap = function () {
  return src("./bootstrap/dist/**/*", { cwd: config.path.node_modules })
    .pipe(dest("./third_party/bootstrap", { cwd: config.path.output }));
};

let fontAwesome = function () {
  return src("./font-awesome/**/*", { cwd: config.path.node_modules })
    .pipe(dest("./third_party/font-awesome", { cwd: config.path.output }));
};

module.exports = series(
  clean,
  parallel(jquery, popper, bootstrap, fontAwesome)
);