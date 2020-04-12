let accessLogger = require("./lib/log/accesslogger.js");
let systemLogger = require("./lib/log/systemlogger.js");
let express = require("express");
let app = express();

app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use("/public", express.static(__dirname + "/public/" +
  (process.env.NODE_ENV === "development" ? "development" : "production")));

app.use(accessLogger());

app.use("/", require("./routes/index.js"));

app.use(systemLogger());

app.listen(3000, () => {
  console.log("start server...");
});
