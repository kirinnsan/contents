let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config.js");
let router = require("express").Router();
let MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  let keyword = req.query.keyword || "";

  let regexp = new RegExp(`.*${keyword}.*`);

  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    let db = client.db(DATABASE);
    db.collection("posts").find({
      $or: [{ title: regexp }, { content: regexp }]
    }).sort({ published: -1 }).toArray()
      .then((list) => {
        let data = {
          keyword,
          list
        };
        res.render("./search/list.ejs", data);
      }).catch((error) => {
        throw error;
      }).finally(() => {
        client.close();
      });
  });

});

module.exports = router;