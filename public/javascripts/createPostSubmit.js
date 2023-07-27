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

    const html = `
            <div class="card mx-auto custom-card" id="prova">
              <div class="row post-header col-12 py-2 px-3">
                <div class="col-6 float-left">
                  <img src="${userPfp}" alt="pfp" />
                  <span>${user}</span>
                </div>
                <div class="col-6 float-right text-right post-number">
                  <span>Just now</span>
                </div>
              </div>
              <img class="card-img" src="http://127.0.0.1:8000${data.image}" alt="Card image cap" />
              <div class="card-body px-3">
                <div class="d-flex justify-content-start">
                  <div
                    class="heart-div-unclick"
                    id="${data.id}"
                    onclick="likeResponse('${user}', ${data.id})"
                  >
                    <span id="heart" class="material-symbols-outlined">
                      favorite
                    </span>
                  </div>
                  <span class="ms-2 pr-5" id="explore-likes--${data.id}"
                    >0
                  </span>
                </div>
                <pre>${content} 
                 </pre>
              </div>
              <div class="row post-header px-3 pb-3">
                <a
                  href="/social-media/${user}/${data.id}"
                  class="col-10 float-left text-left"
                  >Read more...</a
                >
              </div>
            </div>
      `;
    document
      .getElementById("posts-container")
      .insertAdjacentHTML("afterbegin", html);
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
