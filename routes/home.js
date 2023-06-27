const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const User = require("../models/user");
//Home Page
router.get("/social-media", (req, res) => {
  res.render("pages/home");
});

//Login Page
router.get("/social-media/login", (req, res) => {
  res.render("pages/login");
});

//Sign Up Page
router.get("/social-media/signup", (req, res) => {
  res.render("pages/signup");
});

//Sign Up Post
router.post("/social-media/signup", async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, username, password } = req.body;
  const u = new User({ firstname, lastname, email, username, password });
  await u.save();
  res.redirect("/social-media/login");
});

//Login Post
router.post("/social-media/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const u = await User.findOne({ username: username, password: password });
  if (u) {
    const name = u.firstname;
    res.render("pages/welcome", { name });
  } else {
    res.send("Invalid username or password :(");
  }
});

module.exports = router;
