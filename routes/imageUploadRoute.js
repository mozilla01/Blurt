const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

//Render Add Profile Picture
router.get("/addProfilePic", isLoggedIn, (req, res) => {
  res.render("users/addProfilePic");
});

// Add Profile Picture
router.post(
  "/addProfilePic",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id);

    if (!user.image) {
      user.image = {};
    }

    user.image.url = req.file.path;
    user.image.filename = req.file.filename;

    await user.save();
    req.flash("success", "Profile Picture Added Successfully");
    res.redirect("/social-media");
  }
);

//Render Edit Profile Picture

router.get("/editProfilePic", isLoggedIn, (req, res) => {
  const user = req.user;
  const imgLink = user.image.url.replace("/upload", "/upload/,w_400");
  console.log(imgLink, typeof imgLink);
  res.render("users/editProfilePic", { imgLink });
});

//Edit Profile Picture
router.post(
  "/editProfilePic",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id);

    if (user.image) {
      try {
        const message = await cloudinary.uploader.destroy(user.image.filename);
        console.log(message);
      } catch (e) {
        console.log(e);
      }
    }

    user.image.url = req.file.path;
    user.image.filename = req.file.filename;

    await user.save();
    req.flash("success", "Profile Picture Edited Successfully");
    res.redirect("/social-media");
  }
);

//Delete Profile Picture
router.get("/deleteProfilePic", isLoggedIn, async (req, res) => {
  const user = await User.findById(res.locals.currentUser._id);

  await cloudinary.uploader.destroy(user.image.filename);
  user.image = null;
  await user.save();
  console.log(user);

  req.flash("success", "Profile Picture Deleted Successfully");
  res.redirect("/social-media");
});

module.exports = router;
