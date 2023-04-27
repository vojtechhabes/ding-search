const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const xss = require("xss");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get("/", async (req, res) => {
  let query = req.query.q;

  if (!query) {
    res.redirect("/");
    return;
  }

  if (query.length > process.env.MAX_QUERY_LENGTH) {
    res.redirect("/?tl=true");
    return;
  }

  query = xss(query);

  const client = await pool.connect();

  const databaseQuery = {
    text: `select id, title, url, description,
  ts_rank(search, websearch_to_tsquery('english', $1)) +
  ts_rank(search, websearch_to_tsquery('simple', $1))
  as rank
  from crawled
  where search @@ websearch_to_tsquery('english', $1)
  or search @@ websearch_to_tsquery('simple', $1)
  order by rank desc
  limit ${process.env.MAX_NUM_RESULTS};`,
    values: [query],
  };

  const results = await client.query(databaseQuery);

  client.release();

  const safeResults = results.rows.map((result) => {
    return {
      id: result.id,
      title: xss(result.title),
      url: xss(result.url),
      description: xss(result.description),
      rank: result.rank,
    };
  });

  res.render("search", {
    title: `${query} - Ding Search`,
    query: query,
    results: safeResults,
  });
});

router.get("/suggestions", async (req, res) => {
  let query = req.query.q;

  if (!query) {
    res.json([]);
    return;
  }

  if (query.length > process.env.MAX_QUERY_LENGTH) {
    res.json([]);
    return;
  }

  if (query.length < 3) {
    res.json([]);
    return;
  }

  if (query.includes('"')) {
    res.json([]);
    return;
  }

  if (query.split("").every((char) => char === query[0])) {
    res.json([]);
    return;
  }

  query = xss(query);

  let completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    max_tokens: 5,
    messages: [
      {
        role: "user",
        content: `Complete this search query: "${query}".`,
      },
    ],
  });

  completion = xss(completion.data.choices[0].message.content);
  completion = completion.replace(/"/g, "");

  let suggestions = [completion];

  res.json(suggestions);
});

module.exports = router;
