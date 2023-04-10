const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, "views");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", viewsPath);

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
