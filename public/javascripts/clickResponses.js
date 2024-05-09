
const url = document.getElementById("url").value;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const likeResponse = async (user, id) => {
  const csrftoken = getCookie("csrftoken");
  const like = document.getElementById(id);

  let likeCount;
  likeCount = document.getElementById(`explore-likes--${id}`).innerHTML;

  if (like.classList.contains("heart-div-click")) {
    --likeCount;
  } else {
    ++likeCount;
  }

  // Manipulating dom to show
  document.getElementById(`explore-likes--${id}`).innerHTML = likeCount;
  like.classList.toggle("heart-div-click");
  const response = await fetch(`${url}/api/like-post/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ user: user, post: [id] }),
  });
};
