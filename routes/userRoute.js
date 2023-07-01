const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const { isLoggedIn } = require("../middleware");

const fetchPosts = async (q) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/posts/?q=${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const createPost = async (user, messageText) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/create-post/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user: user, content: messageText }),
    });
  } catch (err) {
    console.error(err);
  }
};
const editPost = async (id, user, messageText) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/edit-post/${id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user: user, content: messageText }),
    });
  } catch (err) {
    console.error(err);
  }
};

//Welcome Page
router.get("/welcome", async (req, res) => {
  res.render("pages/welcome");
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
        res.redirect("/social-media");
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
    const redirectUrl = res.locals.returnTo || "/social-media";
    res.redirect(redirectUrl);
  }
);

//Registered User Welcome
router.get(
  "/social-media",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const posts = await fetchPosts("");
    const user = await res.locals.currentUser;
    const userPosts = await fetchPosts(res.locals.currentUser.username);
    res.render("pages/main", { posts, user, userPosts });
  })
);

// Create post
router.post(
  "/social-media/create-post",
  catchAsync(async (req, res) => {
    createPost(res.locals.currentUser.username, req.body.content);
    req.flash("success", "New post created!");
    res.redirect("/social-media");
  })
);

// Edit post
router.post(
  "/social-media/edit-post",
  catchAsync(async (req, res) => {
    const id = req.body.post_id;
    const content = req.body.content;
    const response = await fetch(`http://127.0.0.1:8000/api/edit-post/${id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: res.locals.currentUser.username,
        content: content,
      }),
    });
    const data = await response.json();
    console.log(data);
    res.redirect("/social-media");
  })
);

// Delete post
router.post(
  "/social-media/delete-post",
  catchAsync(async (req, res) => {
    const id = req.body.post_id;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete-post/${id}/`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
    res.redirect("/social-media");
  })
);

//Logout Get

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Sucessfully Logged Out!");
    res.redirect("/welcome");
  });
});

module.exports = router;
