const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const user = require("../controllers/user");
const { storeReturnTo } = require("../middleware");

//Welcome Page
router.get("/welcome", async (req, res) => {
  res.render("pages/welcome");
});

//Register Get
router.get("/register", user.renderRegister);

//Register Post
router.post("/register", catchAsync(user.registerUser));

//Login Get
router.get("/login", user.renderLogin);

//Login Post
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  user.loginUser
);

//Logout Get

router.get("/logout", user.logoutUser);

module.exports = router;
