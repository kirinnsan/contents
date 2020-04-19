let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config");
let MongoClient = require("mongodb").MongoClient;
let router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/posts/regist", (req, res) => {
  res.render("./account/posts/regist-form.ejs");
});

router.post("/posts/regist/input", (req, res) => {
  let original = createRegistData(req.body);
  res.render("./account/posts/regist-form.ejs", { original });

});

router.post("/posts/regist/confirm", (req, res) => {
  let original = createRegistData(req.body);
  let errors = validateRegistData(req.body);
  if (errors) {
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }
  res.render("./account/posts/regist-confirm.ejs", { original });
});

router.post("/posts/regist/execute", (req, res) => {
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
        res.render("./account/posts/regist-complete.ejs");
      })
      .catch((error) => {
        throw error;
      }).finally(() => {
        client.close();
      });
  });

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