const sendReply = async (user, post) => {
  const content = document.getElementById("reply-content").value;
  const response = await fetch("http://127.0.0.1:8000/api/send-reply/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ user: user, content: content, post: post }),
  });
  const data = await response.json();
  console.log(data);
  const html = `<div class="card mb-4" id="reply-${data.id}"><div class="card-body">
            <p>${content}</p>
            <div class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                <!-- <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                alt="avatar"
                width="25"
                height="25"
                /> -->
                <p class="small mb-0 ms-2">${user}</p>
                </div>
                <div class="d-flex flex-row align-items-center">
                <p class="small text-muted mb-0">Just now</p>
                <i
                    class="far fa-thumbs-up mx-2 fa-xs text-black"
                    style="margin-top: -0.16rem"
                ></i>
                      <span
                        class="material-symbols-outlined"
                        id="delete-reply"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        data-bs-whatever="@mdo"
                        onclick="document.getElementById('delete-id').value=${data.id}"
                      >
                        delete
                      </span>
                </div>
            </div>
            </div>
        </div>`;
  const repliesContainer = document.getElementById("replies");
  repliesContainer.insertAdjacentHTML("afterbegin", html);
  document.getElementById("reply-content").value = "";
};

const deleteReply = async () => {
  const id = document.getElementById("delete-id").value;

  const response = await fetch(
    `http://127.0.0.1:8000/api/delete-reply/${id}/`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const data = await response.json();
  document.getElementById(`reply-${id}`).remove();
  document.querySelector(".btn-close").click();
};
