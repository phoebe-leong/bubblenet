window.onload = async () => {
	const id = window.location.pathname.split('/')[2]
	const data = await fetch(`http://127.0.0.1:8000/data/${id}.json`)
		.then((data) => data.json())

	if (data.hasMedia) {
		document.querySelector("img").src = data.mediaLink
	} else {
		document.querySelector("img").src = "/media/image-placeholder.png"
	}

	document.getElementById("post-text").innerHTML = data.content
	document.getElementById("unix-time").innerHTML = `Posted: ${data.unixTimestamp} (UTC+10)`
	document.getElementById("post-id").innerHTML = `Post Id: ${id}`
}