const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const catchAsync = require("../utils/catchAsync");
const mainPage = require("../controllers/mainPage");

const { isLoggedIn } = require("../middleware");

//Registered User Welcome
router.get("/social-media", isLoggedIn, catchAsync(mainPage.renderMainPage));

module.exports = router;
