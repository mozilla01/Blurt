const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const catchAsync = require("../utils/catchAsync");
const request = require("../controllers/request");

const {
  isLoggedIn,
  isAuthUser,
  isSelf,
  LogInRedirect,
} = require("../middleware");

//Send Request

router.get(
  "/social-media/:username/followrequest",
  isLoggedIn,
  isSelf,
  LogInRedirect,
  catchAsync(request.sendRequest)
);

//Accept Request
router.get(
  "/social-media/:username/acceptrequest",
  isLoggedIn,
  LogInRedirect,
  catchAsync(request.acceptRequest)
);

//Cancel Request
router.get(
  "/social-media/:username/cancelrequest",
  isLoggedIn,
  isSelf,
  LogInRedirect,
  catchAsync(request.cancelRequest)
);

//Unfollow
router.get(
  "/social-media/:username/unfollow",
  isLoggedIn,
  catchAsync(request.unfollow)
);

//Friends Page
router.get(
  "/social-media/:username/friends",
  isLoggedIn,
  isAuthUser,
  LogInRedirect,
  catchAsync(request.renderFriendsPage)
);

//Invitations Page
router.get(
  "/social-media/:username/invitations",
  isLoggedIn,
  isAuthUser,
  LogInRedirect,
  catchAsync(request.renderInvitationsPage)
);

module.exports = router;

//*****IF PUBLIC ACCOUNT */

// //Follow

// router.get(
//   "/social-media/:username/follow",
//   isLoggedIn,
//   catchAsync(async (req, res) => {
//     const { username } = req.params;
//     const user = await User.findOne({ username });

//     if (user) {
//       await user.updateOne({ $addToSet: { followers: req.user._id } });
//       await req.user.updateOne({ $addToSet: { following: user._id } });

//       req.flash("success", `Following ${username}`);

//       const previousUrl = req.headers.referer || "/social-media";
//       res.redirect(previousUrl);
//     } else {
//       req.flash("error", "Could Not Find User");
//       const previousUrl = req.headers.referer || "/social-media";
//       res.redirect(previousUrl);
//     }
//   })
// );

//************************************************* */
