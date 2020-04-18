let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config.js");
let { MAX_ITEM_PER_PAGE } = require("../config/app.config.js").search;
let router = require("express").Router();
let MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  let page = req.query.page ? Number(req.query.page) : 1;
  let keyword = req.query.keyword || "";
  let regexp = new RegExp(`.*${keyword}.*`);

  let query = { $or: [{ title: regexp }, { content: regexp }] };

  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    let db = client.db(DATABASE);

    Promise.all([
      db.collection("posts")
        .find(query)
        .count(),
      db.collection("posts").find(query)
        .sort({ published: -1 })
        .skip((page - 1) * MAX_ITEM_PER_PAGE)
        .limit(MAX_ITEM_PER_PAGE)
        .toArray()
    ])
      .then((results) => {
        let data = {
          keyword,
          count: results[0],
          list: results[1],
          pagination: {
            max: Math.ceil(results[0] / MAX_ITEM_PER_PAGE),
            current: page
          }
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