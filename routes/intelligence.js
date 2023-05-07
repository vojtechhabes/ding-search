const express = require("express");
const router = express.Router();
const xss = require("xss");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.get("/suggestions", async (req, res) => {
  let query = req.query.q;

  query = xss(query);

  if (
    !query ||
    query.length > process.env.MAX_QUERY_LENGTH ||
    query.length < 3 ||
    query.split("").every((char) => char === query[0])
  ) {
    res.json([]);
    return;
  }

  let completion = await openai.createCompletion({
    model: "text-ada-001",
    prompt: `Complete this search query:\nquery: ${query}`,
    temperature: 0.1,
    max_tokens: 10,
    stop: ["\n"],
  });

  completion = xss(completion.data.choices[0].text);
  completion = completion.replace(/"/g, "");

  if (
    completion === query ||
    completion.length > process.env.MAX_QUERY_LENGTH
  ) {
    res.json([]);
    return;
  }

  let suggestions = [query + completion];

  res.json(suggestions);

  return;
});

module.exports = router;
