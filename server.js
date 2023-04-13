const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const favicon = require("serve-favicon");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, "views");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", viewsPath);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const searchRouter = require("./routes/search");
app.use("/search", searchRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
