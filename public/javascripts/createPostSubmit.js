// Handling the create post form submit
const createPost = async () => {
  const createPostForm = document.querySelector("#createPostForm");
  const content = document.querySelector("#message-text").value;
  const file = document.querySelector("#post-image");
  const user = document.querySelector("#create-post-user").value;
  const userPfp = document.querySelector("#user-img").value;
  const image = file.files[0];
  let form_data = new FormData();
  if (image) {
    form_data.append("image", image, image.name);
  }
  form_data.append("content", content);
  form_data.append("user", user);
  try {
    const response = await fetch("http://127.0.0.1:8000/api/create-post/", {
      method: "POST",
      body: form_data,
    });
    const data = await response.json();
    console.log(data);
    document.getElementById("create-post-close").click();
    createPostForm.reset();

    location.reload();
  } catch (err) {
    console.error(err);
  }
};

document
  .getElementById("createPostForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    createPost();
  });
