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
