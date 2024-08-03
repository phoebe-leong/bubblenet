async function newPost(content, link) {
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
	document.querySelector("textarea").value = ""
	document.querySelector("input").value = ""
	
	alert("Posted!")
}