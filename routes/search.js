const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    res.redirect("/");
  }

  const client = await pool.connect();

  const databaseQuery = {
    text: `select id, title, url, description,
  ts_rank(search, websearch_to_tsquery('english', $1)) +
  ts_rank(search, websearch_to_tsquery('simple', $1))
  as rank
  from crawled
  where search @@ websearch_to_tsquery('english', $1)
  or search @@ websearch_to_tsquery('simple', $1)
  order by rank desc;`,
    values: [query],
  };

  const results = await client.query(databaseQuery);

  client.release();

  res.render("search", {
    title: `${query} - Ding Search`,
    results: results.rows,
  });
});

module.exports = router;
