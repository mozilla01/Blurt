const sendReply = async (user, post, pfp) => {
    console.log(user);
    const content = document.getElementById("reply-content").value;
    const type = document.getElementById("post-type").value;
    console.log(type);
    const response = await fetch(`${url}/api/send-reply/`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            user: user,
            content: content,
            parent: post,
            type: type,
        }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
};

const deleteReply = async () => {
    const id = document.getElementById("delete-id").value;

    const response = await fetch(`${url}/api/delete-reply/${id}/`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
    });
    const data = await response.json();
    document.getElementById(`reply-${id}`).remove();
    document.querySelector(".btn-close").click();
};


const getNestedReplies = async (id) => {

  const response = await fetch(`${url}/api/replies/${id}/`);
  const replies = await response.json();
    console.log(replies);
    let html = '';
    for (const reply of replies) {
        const replyHTML = `
                        <div class="card my-1">
        <div class="card-body pe-0 m-0 pt-2">
                            <div class="d-flex row container-fluid p-0">
                              <div class="d-inline-flex col-auto ps-0 pe-2">
                                <img
                                  src=
        "https://res.cloudinary.com/dyg5zmebj/image/upload//c_fill,g_face,h_48,w_48/f_png/r_max/v1688626927/Social-Media/umntgolhyfldrjkcxm27.jpg"
                                  class="m-1"
                                  width="30"
                                  height="30"
                                  alt=""
                                />
                              </div>
                              <div class="col p-0">
                                <div class="col">
                                  <div
                                    class="d-flex justify-content-between container-fluid p-0"
                                  >
                                    <div class="d-flex p-0">
                                      <div
                                        class="d-flex m-0 p-0 text-break text-wrap"
                                      >
                                        <h5 id="reply-user">
                                          @${reply.user}
                                        </h5>
                                      </div>
                                      <div
                                        class="d-flex container-fluid col-auto p-0"
                                      >
                                        <p id="reply-created">
                                          - ${reply.created}
                                        </p>
                                      </div>
                                    </div>
                                    <div class="d-flex">
                                    </div>
                                  </div>

                                  <a href=\'/social-media/${reply.user}/${reply.id}\' id="reply-content">${reply.content}</a>
                                </div>
                                ${ reply.comments > 0 ? `<button onclick=\'getNestedReplies(${reply.id});document.getElementById(\"button-${reply.id}\").style.display=\"none\"\' class="get-nested-replies btn btn-link" id=\"button-${reply.id}\">+ Read more replies</button>` : ''}
                        <div class="card my-1" id='nested-replies-${reply.id}'></div>
                              </div>
                            </div>
                          </div></div>`;
                html = html.concat(replyHTML);                           
    }
    console.log(html);
    document.getElementById(`nested-replies-${id}`).innerHTML = html;
}
