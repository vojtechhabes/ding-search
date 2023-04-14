const express = require("express");
const router = express.Router();
const xss = require("xss");

router.get("/", (req, res) => {
  res.render("index", {
    title: "Ding Search",
    query: "",
    tl: xss(req.query.tl),
  });
});

module.exports = router;
