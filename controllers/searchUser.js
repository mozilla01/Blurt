const User = require("../models/user");
const config = require("../config");

const url = config.url;

module.exports.search = async (req, res) => {
  const qUser = req.query.username;
  const currentUser = await res.locals.currentUser;
  const thisUser = await User.findOne(currentUser._id)
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");

  let users = [];
  if (qUser) {
    users = await User.find({
      username: { $regex: `^${qUser}`, $options: "i" },
    });
    console.log(users);
  } else {
    users = await User.find(
      { _id: { $ne: thisUser._id } },
      { username: 1, image: 1, _id: false }
    );
  }

  res.render("pages/find", { thisUser, users, url });
};
