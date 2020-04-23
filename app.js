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

app.use("/api", (() => {
  let router = express.Router();
  router.use("/posts", require("./api/post.js"));
  return router;

})());

app.use("/", (() => {
  let router = express.Router();
  router.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
  });
  router.use("/posts/", require("./routes/posts.js"));
  router.use("/search/", require("./routes/search.js"));
  router.use("/account/", require("./routes/account.js"));
  router.use("/", require("./routes/index.js"));
  return router;
})());

app.use(systemLogger());

app.use((req, res, next) => {
  let data = {
    method: req.method,
    protocal: req.protocol,
    version: req.httpVersion,
    url: req.url
  };
  res.status(404);
  // ajaxの場合
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("./404.ejs", { data });
  }
});

app.use((err, req, res, next) => {
  let data = {
    method: req.method,
    protocal: req.protocol,
    version: req.httpVersion,
    url: req.url,
    error: (process.env.NODE_ENV === "development") ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    } : undefined
  };
  res.status(500);
  // ajaxの場合
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("./500.ejs", { data });
  }
});

app.listen(3000, () => {
  console.log("start server...");
});
