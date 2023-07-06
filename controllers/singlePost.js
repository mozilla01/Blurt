const time = require("../public/javascripts/time");
const userLikes = require("./mainPage");

const fetchSinglePost = async (q) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/post/${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports.viewSinglePost = async (req, res) => {
  const { postId } = req.params;
  const singlePost = await fetchSinglePost(postId);
  const user = res.locals.currentUser.username;
  const likes = await userLikes.getLikes(user);
  singlePost.created = time.timeSince(new Date(singlePost.created));

  //Getting post replies
  const response = await fetch(`http://127.0.0.1:8000/api/replies/${postId}/`);
  const replies = await response.json();

  for (let likeID of likes[0].post) {
    if (likeID === singlePost.id) singlePost.liked = true;
  }

  for (let reply of replies) {
    reply.created = time.timeSince(new Date(reply.created));
  }
  res.render("pages/post", { singlePost, replies, user });
};
