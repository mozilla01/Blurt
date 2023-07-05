const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const catchAsync = require("../utils/catchAsync");
const singlePost = require("../controllers/singlePost");
//View Single Post

router.get(
  "/social-media/:username/:postId",
  catchAsync(singlePost.viewSinglePost)
);

module.exports = router;
