const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const catchAsync = require("../utils/catchAsync");
const singlePost = require("../controllers/singlePost");
const { isLoggedIn } = require("../middleware");
//View Single Post

router.get(
  "/social-media/:username/:postId",
  isLoggedIn,
  catchAsync(singlePost.viewSinglePost)
);

module.exports = router;
