const fetchSinglePost = async q => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/post/${q}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports.viewSinglePost = async (req, res) => {
  const { username, postId } = req.params;
  const singlePost = await fetchSinglePost(postId);
  res.render("pages/post", { singlePost });
};
