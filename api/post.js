let { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config");
let router = require("express").Router();
let MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    let db = client.db(DATABASE);
    db.collection("posts").findOne({
      url: req.url
    }, {
      projection: { _id: 0 } // _idの非表示
    }
    ).then((doc) => {
      res.json(doc);
    }).catch((errpr) => {
      throw error;
    }).finally(() => {
      client.close();
    });
  });
});

module.exports = router;