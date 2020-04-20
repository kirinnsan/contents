let { SESSION_SECRET } = require("./config/app.config").security;
let accessLogger = require("./lib/log/accesslogger.js");
let systemLogger = require("./lib/log/systemlogger.js");
let accountcontrol = require("./lib/security/account-control.js");
let express = require("express");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let flash = require("connect-flash");
let app = express();

app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use("/public", express.static(__dirname + "/public/" +
  (process.env.NODE_ENV === "development" ? "development" : "production")));

app.use(accessLogger());

app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
// 分割代入
app.use(...accountcontrol.initialize());

app.use("/", require("./routes/index.js"));
app.use("/posts/", require("./routes/posts.js"));
app.use("/search/", require("./routes/search.js"));
app.use("/account/", require("./routes/account.js"));

app.use(systemLogger());

app.listen(3000, () => {
  console.log("start server...");
});
