const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/searchController");

router.get("/", SearchController.search);

module.exports = router;
