const likeResponse = id => {
  const like = document.getElementById(id);
  like.classList.toggle("heart-div-click");
  console.log(like);
};
