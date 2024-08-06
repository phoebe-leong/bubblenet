async function newPost(content, link) {
	if (document.querySelector("textarea").value != "") {
		const hasMedia = (link == "") ? false : true

		await fetch("/data/messages.json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				content: content,
				hasMedia: hasMedia,
				mediaLink: link
			})
		})
		alert("Posted!")
		window.location.href = "/feed"
	} else {
		alert("Post content can not be empty")
	}
}