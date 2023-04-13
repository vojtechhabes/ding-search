const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const question = req.query.question;
  res.render("search", { title: `${question} - Ding Search` });
});

module.exports = router;
