const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Ding Search",
    query: "",
    tl: req.query.tl,
  });
});

module.exports = router;
