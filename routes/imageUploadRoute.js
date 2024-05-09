const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

//Render Add Profile Picture
// router.get("/addProfilePic", isLoggedIn, async (req, res) => {
//   const currentUsername = req.user.username;

//   const thisUser = await User.findOne({ username: currentUsername });
//   // .populate("followers", "username -_id")
//   // .populate("following", "username -_id")
//   // .populate("requested_outgoing", "username -_id")
//   // .populate("requested_incoming", "username -_id");

//   res.render("users/addProfilePic", { thisUser });
// });

// // Add Profile Picture
// router.post(
//   "/addProfilePic",
//   isLoggedIn,
//   upload.single("image"),
//   async (req, res) => {
//     const user = await User.findById(res.locals.currentUser._id);

//     if (!user.image) {
//       user.image = {};
//     }

//     user.image.url = req.file.path;
//     user.image.filename = req.file.filename;

//     await user.save();
//     req.flash("success", "Profile Picture Added Successfully");
//     res.redirect("/social-media");
//   }
// );

//Render Edit Profile Picture

router.get(
  "/social-media/edit-profile-picture",
  isLoggedIn,
  async (req, res) => {
    const user = req.user;
    const currentUsername = user.username;
    const thisUser = await User.findOne({ username: currentUsername });
    let isImage = false;
    let imgLink =
      "https://res.cloudinary.com/dyg5zmebj/image/upload/h_200,w_200/v1710135560/Social-Media/evzwtexuvy5xulnluwva.png";
    if (user.image) {
      imgLink = user.image.url.replace("/upload", "/upload/h_200,w_200");
      isImage = true;
    }

    console.log(imgLink, typeof imgLink);
    res.render("users/editProfilePic", { thisUser, imgLink, isImage });
  }
);

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
    user.image = {};
    if (req.file) {
      user.image.url = req.file.path;
      user.image.filename = req.file.filename;

      await user.save();
      req.flash("success", "Profile Picture Edited Successfully");
      res.redirect("/social-media");
    }
    if (!req.file) {
      req.flash("error", "Choose An Image To Upload");
      res.redirect("/social-media/edit-profile-picture");
    }
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
