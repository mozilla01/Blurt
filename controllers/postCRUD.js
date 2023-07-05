const createPost = async (user, messageText) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/create-post/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user: user, content: messageText }),
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports.createPost = async (req, res) => {
  createPost(res.locals.currentUser.username, req.body.content);
  req.flash("success", "New post created!");
  res.redirect("/social-media");
};

module.exports.editPost = async (req, res) => {
  const id = req.body.post_id;
  const content = req.body.content;
  const response = await fetch(`http://127.0.0.1:8000/api/edit-post/${id}/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      user: res.locals.currentUser.username,
      content: content,
    }),
  });
  const data = await response.json();
  res.redirect("/social-media");
};

module.exports.deletePost = async (req, res) => {
  const id = req.body.post_id;
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/delete-post/${id}/`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(data);
    req.flash("success", "Post Deleted");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error Occured");
  }

  res.redirect("/social-media");
};
