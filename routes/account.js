let router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
})

module.exports = router;