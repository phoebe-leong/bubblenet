async function newPost(content, link, upload) {
	if (document.querySelector("textarea").value != "") {
		const fileData = new FormData()
			fileData.append("content", content)
			fileData.append("mediaLink", link)
			fileData.append("mediaFile", upload.files[0])

		const hasMedia = (link == "" && document.getElementById("upload").value == "") ? "false" : "true"
		fileData.append("hasMedia", hasMedia)

		await fetch("/data/messages.json", {
			method: "POST",
			body: fileData
		})

		alert("Posted!")
		window.location.href = "/feed"
	} else {
		alert("Post content can not be empty")
	}
}