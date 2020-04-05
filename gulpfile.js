var config = require("./gulp/config.js");
var { series } = require("gulp");
var load = require("require-dir");
var tasks, development, production;

tasks = load("./gulp/tasks", { recurse: true });

development = series(
  tasks["clean-log"],
  tasks["copy-third_party"],
  tasks["copy-images"],
  tasks["copy-javascripts"],
  tasks["compile-sass"]
);

production = series(
  tasks["clean-log"],
  tasks["copy-third_party"],
  tasks["copy-images"],
  tasks["minify-javascripts"],
  tasks["compile-sass"]
);

module.exports = {
  development,
  production,
  default: config.env.IS_DEVELOPMENT ? development : production
};