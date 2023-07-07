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

    req.flash("success", `${username} started following you`);

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
  const user = await User.findOne({ username })
    .populate("followers", "username image -_id")
    .populate("following", "username image -_id")
    .populate("requested_outgoing", "username image -_id")
    .populate("requested_incoming", "username image -_id");
  res.render("pages/friends", { user });
};

module.exports.renderInvitationsPage = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username })
    .populate("requested_incoming", "username image -_id")
    .populate("requested_outgoing", "username image -_id");
  res.render("pages/invitations", { user });
};
