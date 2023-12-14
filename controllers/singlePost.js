const time = require("../public/javascripts/time");
const userLikes = require("./mainPage");
const User = require("../models/user");
const config = require("../config");

const url = config.url;

fetchSinglePost = async (q) => {
  try {
    const response = await fetch(`${url}/api/post/${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports.viewSinglePost = async (req, res) => {
  const { postId } = req.params;
  const singlePost = await fetchSinglePost(postId);

  const user = res.locals.currentUser;
  const likes = await userLikes.getLikes(user.username);
  singlePost.created = time.timeSince(new Date(singlePost.created));

  const singlePostObject = await User.findOne({ username: singlePost.user });
  if (!singlePostObject.image) {
    singlePost.pfp =
      "https://res.cloudinary.com/dyg5zmebj/image/upload//c_fill,g_face,h_48,w_48/f_png/r_max/v1688626927/Social-Media/umntgolhyfldrjkcxm27.jpg";
  } else {
    singlePost.pfp = singlePostObject.image.pfp;
  }

  console.log(user.username);
  //Getting post replies
  const response = await fetch(`${url}/api/replies/${postId}/`);
  const replies = await response.json();

  for (let likeID of likes[0].post) {
    if (likeID === singlePost.id) singlePost.liked = true;
  }

  for (let reply of replies) {
    reply.created = time.timeSince(new Date(reply.created));

    const userObject = await User.findOne({ username: reply.user });
    console.log(userObject);
    if (!userObject.image)
      reply.pfp =
        "https://res.cloudinary.com/dyg5zmebj/image/upload//c_fill,g_face,h_48,w_48/f_png/r_max/v1688626927/Social-Media/umntgolhyfldrjkcxm27.jpg";
    else reply.pfp = userObject.image.pfp;
  }

  const currentUser = await res.locals.currentUser;
  const thisUser = await User.findOne(currentUser._id)
    .populate("followers", "username -_id")
    .populate("following", "username -_id")
    .populate("requested_outgoing", "username -_id")
    .populate("requested_incoming", "username -_id");

  const users = await User.find(
    { _id: { $ne: thisUser._id } },
    { username: 1, image: 1, _id: false }
  );

  res.render("pages/post2", { singlePost, replies, thisUser, users, url });
};

