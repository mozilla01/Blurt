const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const homeroute = require("./routes/home");
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/social-media");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", homeroute);

app.get("/", (req, res) => {
  res.send("Social Media App");
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
