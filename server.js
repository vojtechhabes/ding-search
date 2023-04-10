const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", `${__dirname}/views`);

app.get("/", (req, res) => {
  res.render("index", { title: "Ding Search" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
