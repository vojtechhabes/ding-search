const xss = require("xss");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

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
      fs.unlinkSync(filePath);
      console.log("No file uploaded");
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, function (err, metadata) {
        if (err) {
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });

    let duration = metadata.format.duration;

    if (duration == "N/A") {
      const sampleRate = metadata.streams[0].sample_rate;
      const sizeBytes = metadata.format.size;
      const sizeBits = sizeBytes * 8;
      duration = sizeBits / sampleRate;
    }

    if (duration > 6) {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: "Audio too long" });
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
