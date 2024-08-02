function newFeedItem(data) {
	const characterLimit = 48
	let shortenedText = data.content

	if (shortenedText.length > characterLimit) {
		while (shortenedText.length != characterLimit) {
			shortenedText = shortenedText.slice(0, -1)
		}
		shortenedText = `${shortenedText}...`
	}

	const container = document.createElement("div")
		container.classList.add("feed-item")

	const img = document.createElement("img")
		img.src = (data.hasMedia) ? data.mediaLink : "/media/image-placeholder.png"
	const text = document.createElement("p")
		text.innerHTML = shortenedText
	const link = document.createElement("p")
		link.classList.add("post-link")
		link.innerHTML = "[click to see full post]"
		link.onclick = () => {
			window.open(`http://127.0.0.1:8000/post/${data.id}`, "_blank")
		}

	container.appendChild(img)
	container.appendChild(text)
	container.appendChild(document.createElement("br"))
	container.appendChild(link)

	return container
}

function placeFeedItem(item) {
	const columns = Array.prototype.slice.call(document.getElementById("feed").children)

	for (let i = 0; i < columns.length; i++) {
		console.log(columns[i])

		if (Array.prototype.slice.call(columns[i].children).length < 6) {
			columns[i].appendChild(item)
			return
		}
	}

	if (columns.length < 5) {
		const column = document.createElement("div")
			column.classList.add("column")

		column.appendChild(item)
		document.getElementById("feed").appendChild(column)
	}
}

window.onload = async () => {
	const feed = await fetch("http://127.0.0.1:8000/data/feed.json")
		.then((data) => data.json())

	for (let i = 0; i < feed.Feed.length; i++) {
		//document.querySelector(".column").appendChild(newFeedItem(feed.Feed[i]))
		placeFeedItem(newFeedItem(feed.Feed[i]))

	}
}