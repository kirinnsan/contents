let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config");
let { authenticate, authorize } = require("../lib/security/account-control.js");
let MongoClient = require("mongodb").MongoClient;
let router = require("express").Router();
let tokens = new require("csrf")();

router.get("/", authorize("readWrite"), (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/account/login");
  }
}, (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", authenticate());

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

router.get("/posts/regist", authorize("readWrite"), (req, res) => {
  tokens.secret((error, secret) => {
    let token = tokens.create(secret);
    req.session._csrf = secret;
    res.cookie("_csrf", token);
    res.render("./account/posts/regist-form.ejs");
  });
});

router.post("/posts/regist/input", authorize("readWrite"), (req, res) => {
  let original = createRegistData(req.body);
  res.render("./account/posts/regist-form.ejs", { original });

});

router.post("/posts/regist/confirm", authorize("readWrite"), (req, res) => {
  let original = createRegistData(req.body);
  let errors = validateRegistData(req.body);
  if (errors) {
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }
  res.render("./account/posts/regist-confirm.ejs", { original });
});

router.post("/posts/regist/execute", authorize("readWrite"), (req, res) => {
  let secret = req.session._csrf;
  let token = req.cookies._csrf;

  if (tokens.verify(secret, token) === false) {
    throw new Error("Invalid Token");
  }

  let original = createRegistData(req.body);
  let errors = validateRegistData(req.body);
  if (errors) {
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }

  MongoClient.connect(CONNECTION_URL, OPTIONS, (errors, client) => {
    let db = client.db(DATABASE);
    db.collection("posts")
      .insertOne(original)
      .then(() => {
        delete req.session._csrf;
        res.clearCookie("_csrf");
        res.redirect("/account/posts/regist/complete");
      })
      .catch((error) => {
        throw error;
      }).finally(() => {
        client.close();
      });
  });

});

router.get("/posts/regist/complete", authorize("readWrite"), (req, res) => {
  res.render("./account/posts/regist-complete.ejs");

});

function createRegistData(body) {
  let datetime = new Date();
  return {
    url: body.url,
    published: datetime,
    update: datetime,
    title: body.title,
    content: body.content,
    keywords: (body.keywords || "").split(","),
    authors: (body.authors || "").split(","),
  };
}

function validateRegistData(body) {
  let isValidated = true, errors = {};
  if (!body.url) {
    isValidated = false;
    errors.url = "URLが未入力です。'/'から始まるURLを入力してください。";
  }
  if (body.url && /\//.test(body.url) === false) {
    isValidated = false;
    errors.url = "'/'から始まるURLを入力してください。";
  }
  if (!body.title) {
    isValidated = false;
    errors.title = "タイトルが未入力です。任意のタイトルを入力してください。";
  }

  return isValidated ? undefined : errors;

}

module.exports = router;