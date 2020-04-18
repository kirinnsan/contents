let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config.js");
let router = require("express").Router();
let MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    let db = client.db(DATABASE);
    db.collection("posts").findOne({
      url:req.url
    }).then((doc) => {
      res.render("./posts/index.ejs", doc);
    }).catch((error) => {
      throw error;
    }).finally(() => {
      client.close();
    });
  });
});


module.exports = router;