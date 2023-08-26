const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const searchUser = require("../controllers/searchUser");

const {
  isLoggedIn,
  isAuthUser,
  isSelf,
  LogInRedirect,
} = require("../middleware");

router.get(
  "/searchUser",
  isLoggedIn,
  LogInRedirect,
  isSelf,
  catchAsync(searchUser.search)
);

module.exports = router;
