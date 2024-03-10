const time = require("../public/javascripts/time");
const User = require("../models/user");
const config = require("../config");

const url = config.url;

const fetchPosts = async (q) => {
  try {
    const response = await fetch(`${url}/api/posts/?q=${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getLikes = async (user) => {
  try {
    const response = await fetch(`${url}/api/get-likes/${user}/`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

module.exports.renderMainPage = async (req, res) => {
  const currentUser = await res.locals.currentUser;
  const thisUser = await User.findOne(currentUser._id)
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");

    let userPosts = [];
    if (req.query.page == "explore") {
        userPosts = await fetchPosts("");
    } else {
        for (const user of thisUser.following) {
            followerPost = await fetchPosts(user.username);
            userPosts.push(followerPost[0]);
        }
    }


  const qUser = req.query.username;
  let users = [];
  if (qUser) {
    users = await User.find({
      username: { $regex: `^${qUser}`, $options: "i" },
    });
  } else {
    users = await User.find(
      { _id: { $ne: thisUser._id } },
      { username: 1, image: 1, _id: false }
    );
  }
  const likes = await getLikes(res.locals.currentUser.username);
    if (userPosts)
  for (let post of userPosts) {
    post.created = time.timeSince(new Date(post.created));
    const trimmedPost = post.content.split("\r\n");
    if (trimmedPost.length >= 7) {
      post.content = trimmedPost.filter((phrase, i) => i < 7).join("\r\n");
      post.trimmed = true;
    }
    const userObject = await User.findOne({ username: post.user });
    if (!userObject.image) {
      post.pfp =
        "https://res.cloudinary.com/dyg5zmebj/image/upload//c_fill,g_face,h_48,w_48/f_png/r_max/v1688626927/Social-Media/umntgolhyfldrjkcxm27.jpg";
    } else {
      post.pfp = userObject.image.pfp;
    }


    // Finding which posts the user has liked.
    if (likes[0])
    for (let likeID of likes[0].post) {
      if (likeID === post.id) post.liked = true;
    }

    if (post.parent) {
        try {
            const response = await fetch(`${url}/api/post/${post.parent}`);
            const data = await response.json();
            post.repliedTo = data.user;
            post.parentData = data;
        } catch (err) {
            console.log(err);
        }
    }
  }

  res.render("pages/main2", { userPosts, thisUser, users, url });
};

exports.getLikes = getLikes;
