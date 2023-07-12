const time = require("../public/javascripts/time");
const User = require("../models/user");

const fetchPosts = async q => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/posts/?q=${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getLikes = async user => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/get-likes/${user}/`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

module.exports.renderMainPage = async (req, res) => {
  const posts = await fetchPosts("");
  const likes = await getLikes(res.locals.currentUser.username);
  console.log(likes);
  for (let post of posts) {
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
    for (let likeID of likes[0].post) {
      if (likeID === post.id) post.liked = true;
    }
  }
  const currentUser = await res.locals.currentUser;
  const user = await User.findOne(currentUser._id)
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");
  const userPosts = await fetchPosts(user.username);
  for (let userPost of userPosts) {
    userPost.created = time.timeSince(new Date(userPost.created));
  }
  const users = await User.find(
    { _id: { $ne: user._id } },
    { username: 1, _id: false }
  );
  res.render("pages/main", { posts, user, userPosts, users });
};

exports.getLikes = getLikes;
