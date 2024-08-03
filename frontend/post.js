window.onload = async () => {
	const id = window.location.pathname.split('/')[2]
	const data = await fetch(`/data/${id}.json`)
		.then((data) => data.json())

	if (data.hasMedia) {
		document.querySelector("img").src = data.mediaLink
	} else {
		document.querySelector("img").src = "/media/image-placeholder.png"
	}

	const container = document.createElement("dialog")
	const image = document.createElement("img")
		image.id = "modal"
		image.src = (data.hasMedia) ? data.mediaLink : "/media/image-placeholder.png"
	const closeBtn = document.createElement("img")
		closeBtn.id = "close"
		closeBtn.src = "/media/close-icon.png"
		closeBtn.onclick = () => {
			document.querySelector("dialog").close()
		}

	container.appendChild(image)
	container.appendChild(closeBtn)

	document.getElementById("post-text").innerHTML = data.content
	document.getElementById("unix-time").innerHTML = `Posted: ${data.unixTimestamp} (UTC+10)`
	document.getElementById("post-id").innerHTML = `Post Id: ${id}`

	document.body.appendChild(container)
}