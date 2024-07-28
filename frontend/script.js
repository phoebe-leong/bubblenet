async function newPost(content, link) {
	const hasMedia = (link == "") ? false : true

	await fetch("http://127.0.0.1:8000/data/messages.json", {
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
}