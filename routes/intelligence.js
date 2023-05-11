const express = require("express");
const router = express.Router();
const IntelligenceController = require("../controllers/intelligenceController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/suggestions", IntelligenceController.getSuggestions);

router.post(
  "/transcription",
  upload.single("audio"),
  IntelligenceController.getTranscription
);

module.exports = router;
