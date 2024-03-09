const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must Login First !");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthUser = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/social-media`);
  }
  next();
};

module.exports.isSelf = async (req, res, next) => {
  const { username } = req.params;

  if (username === req.user.username) {
    req.flash("error", "You getting cheeky X)");
    return res.redirect(`/social-media`);
  }
  next();
};

module.exports.LogInRedirect = async (req, res, next) => {
  if (
    req.headers.referer === "http://blurt.eu-north-1.elasticbeanstalk.com/login"
  ) {
    return res.redirect("/social-media");
  }
  next();
};
