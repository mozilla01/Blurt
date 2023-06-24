const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Social Media App");
});

app.listen(3001, () => {
  console.log("Listening on port 3000");
});
