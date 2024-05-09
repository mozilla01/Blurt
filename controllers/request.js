const User = require("../models/user");

module.exports.sendRequest = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (req.user.following.includes(user._id)) {
    req.flash("error", `Already Following ${username}`);
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  }
  if (req.user.requested_outgoing.includes(user._id)) {
    req.flash("error", `Already Requested ${username}`);
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  }

  if (user) {
    await user.updateOne({ $addToSet: { requested_incoming: req.user._id } });
    await req.user.updateOne({ $addToSet: { requested_outgoing: user._id } });

    req.flash("success", `Request Sent To ${username}`);
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  } else {
    req.flash("error", "Could Not Find User");
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  }
};

module.exports.acceptRequest = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (user) {
    await req.user.updateOne({ $pull: { requested_incoming: user._id } });
    await user.updateOne({ $pull: { requested_outgoing: req.user._id } });
    await req.user.updateOne({ $addToSet: { followers: user._id } });
    await user.updateOne({ $addToSet: { following: req.user._id } });

    req.flash("success", `${username} Started Following You`);

    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  } else {
    req.flash("error", "Could Not Find User");
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  }
};

module.exports.cancelRequest = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (user) {
    await req.user.updateOne({ $pull: { requested_outgoing: user._id } });
    await user.updateOne({ $pull: { requested_incoming: req.user._id } });

    req.flash("error", `Cancelled Request To ${username}`);

    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  } else {
    req.flash("error", "Could Not Find User");
    const previousUrl = req.headers.referer || "/social-media";
    res.redirect(previousUrl);
  }
};

module.exports.unfollow = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (user) {
    await user.updateOne({ $pull: { followers: req.user._id } });
    await req.user.updateOne({ $pull: { following: user._id } });

    req.flash("error", `Unfollowed ${username}`);

    res.redirect(`/social-media/${req.user.username}/friends`);
  } else {
    req.flash("error", "Could Not Find User");
    res.redirect(`/social-media/${req.user.username}/friends`);
  }
};

module.exports.renderFriendsPage = async (req, res) => {
  const { username } = req.params;
  const q = req.query.q;
  const cUser = req.user.username;

  const thisUser = await User.findOne({ username: cUser })
    .populate("followers", "username image -_id")
    .populate("following", "username image -_id")
    .populate("requested_outgoing", "username image -_id")
    .populate("requested_incoming", "username image -_id");

  const currentUser = await User.findOne({ username })
    .populate({
      path: "followers",
      // match: { username: { $ne: cUser } },
      select: "username image -_id",
    })
    .populate({
      path: "following",
      // match: { username: { $ne: cUser } },
      select: "username image -_id",
    });

  for (let i = 0; i < currentUser.followers.length; i++) {
    if (currentUser.followers[i].username === thisUser.username) {
      const temp = currentUser.followers[0];

      currentUser.followers[0] = currentUser.followers[i];
      currentUser.followers[i] = temp;

      break;
    }
  }

  for (let i = 0; i < currentUser.following.length; i++) {
    if (currentUser.following[i].username === thisUser.username) {
      const temp = currentUser.following[0];

      currentUser.following[0] = currentUser.following[i];
      currentUser.following[i] = temp;

      break;
    }
  }

  // .populate("requested_outgoing", "username image -_id")
  // .populate("requested_incoming", "username image -_id");
  const users = await User.find(
    { _id: { $ne: thisUser._id } },
    { username: 1, image: 1, _id: false }
  );
  res.render("pages/friends2", { currentUser, thisUser, users, q });
};

module.exports.renderInvitationsPage = async (req, res) => {
  const { username } = req.params;
  const q = req.query.q;
  const thisUser = await User.findOne({ username })
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_incoming", "username image -_id")
    .populate("requested_outgoing", "username image -_id");

  const users = await User.find(
    { _id: { $ne: thisUser._id } },
    { username: 1, image: 1, _id: false }
  );
  res.render("pages/invitations2", { thisUser, users, q });
};
