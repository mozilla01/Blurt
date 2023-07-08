const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

const fetchPosts = async q => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/posts/?q=${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

router.get("/social-media/:username", isLoggedIn, async (req, res) => {
  const { username } = req.params;
  const userPosts = await fetchPosts(username);
  const currentUsername = req.user.username;

  const thisUser = await User.findOne({ username: currentUsername })
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");

  const user = await User.findOne({ username })
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");

  res.render("pages/profile", { user, thisUser, userPosts });
});

module.exports = router;
