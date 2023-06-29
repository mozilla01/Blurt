const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const { isLoggedIn } = require("../middleware");

const fetchPosts = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/posts/?q=");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
//Home Page
router.get("/social-media", async (req, res) => {
  const posts = await fetchPosts();
  res.render("pages/home", { posts });
});

//Login Page
router.get("/login", (req, res) => {
  res.render("users/login");
});

//Register Get
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Register Post
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { firstname, lastname, email, username, password } = req.body;
      const user = new User({ firstname, lastname, email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Registered Successfully !");
        res.redirect("/welcome");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

//Login Post
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back !");
    const redirectUrl = res.locals.returnTo || "/welcome";
    res.redirect(redirectUrl);
  }
);

//Registered User Welcome
router.get(
  "/welcome",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("pages/welcome");
  })
);

//Logout Get

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Sucessfully Logged Out!");
    res.redirect("/home");
  });
});

module.exports = router;
