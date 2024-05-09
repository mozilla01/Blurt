const config = require("../config");

const url = config.url;

module.exports.editPost = async (req, res) => {
  const id = req.body.post_id;
  const content = req.body.content;
  const response = await fetch(`${url}/api/edit-post/${id}/`, {
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
  req.flash("success", "Post Edited Successfully");
  res.redirect("/social-media");
};

module.exports.deletePost = async (req, res) => {
  const id = req.body.post_id;
  try {
    const response = await fetch(`${url}/api/delete-post/${id}/`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    req.flash("success", "Post Deleted");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error Occured");
  }

  res.redirect("/social-media");
};
