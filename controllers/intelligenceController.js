const xss = require("xss");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class IntelligenceController {
  static async getSuggestions(req, res) {
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
  }

  static async getTranscription(req, res) {
    const file = req.file;
    const filePath = file.path;

    if (!file) {
      res.json({ error: "No file uploaded" });
      return;
    }

    if (path.extname(file.originalname) !== ".webm") {
      fs.unlinkSync(filePath);
      res.json({ error: "Invalid file type" });
      return;
    }

    const response = await openai.createTranscription(
      fs.createReadStream(filePath),
      "whisper-1"
    );
    const transcription = response.data.text;

    fs.unlinkSync(filePath);

    res.json({ transcription: transcription });
  }

  static async getTranscription(req, res) {
    const file = req.file;
    const filePath = file.path;

    if (!file) {
      res.json({ error: "No file uploaded" });
      return;
    }

    if (path.extname(file.originalname) !== ".webm") {
      fs.unlinkSync(filePath);
      res.json({ error: "Invalid file type" });
      return;
    }

    const response = await openai.createTranscription(
      fs.createReadStream(filePath),
      "whisper-1"
    );
    const transcription = response.data.text;

    fs.unlinkSync(filePath);

    res.json({ transcription: transcription });

    return;
  }
}

module.exports = IntelligenceController;
