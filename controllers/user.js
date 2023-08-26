const User = require("../models/user");
const config = require("../config");

const url = config.url;

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;

    const user = new User({
      firstname,
      lastname,
      email,
      username,
    });
    const registeredUser = await User.register(user, password);

    // Creating a Like object for the user
    const response = await fetch(`${url}/api/create-like-object/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user: username }),
    });
    const data = await response.json();

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registered Successfully !");
      res.redirect("/social-media");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back !");
  const redirectUrl = res.locals.returnTo || "/social-media";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Sucessfully Logged Out!");
    res.redirect("/welcome");
  });
};
