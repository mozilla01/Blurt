const editPost = async () => {
  console.log("hello");
  const id = document.getElementById("hidden-id").value;
  const response = await fetch(`${url}/api/post/${id}/`);
  const post = await response.json();
  document.getElementById("message-text-edit").value = post.content;
};
