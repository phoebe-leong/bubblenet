function newFeedItem(data) {
	const characterLimit = (!isMobile) ? 45 : 80
	const oneLineLength = (!isMobile) ? 25 : 48
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
			window.open(`/post/${data.id}`, "_self")
		}

	container.appendChild(img)
	container.appendChild(text)

	if (shortenedText.length < oneLineLength) {
		container.appendChild(document.createElement("br"))
		link.classList.add("short")
	} else if (shortenedText.length == oneLineLength) {
		link.classList.add("line-length")
	}
	
	container.appendChild(document.createElement("br"))
	container.appendChild(link)

	return container
}

function placeFeedItem(item) {
	if (!isMobile) {
		const maxColLength = 5
		const maxItems = 6

		const columns = Array.prototype.slice.call(document.getElementById("feed").children)

		for (let i = 0; i < columns.length; i++) {
			if (Array.prototype.slice.call(columns[i].children).length < maxItems) {
				columns[i].appendChild(item)
				return
			}
		}

		if (columns.length < maxColLength) {
			const column = document.createElement("div")
				column.classList.add("column")

			column.appendChild(item)
			document.getElementById("feed").appendChild(column)
		}
	} else {
		document.getElementById("feed").appendChild(item)
	}
}

async function fetchFeed() {
	if (document.querySelector(".column") != null) {
		const columns = Array.prototype.slice.call(document.getElementById("feed").children)

		for (let i = 0; i < columns.length; i++) {
			columns[i].remove()
		}
	}

	const feed = await fetch("/data/feed.json")
		.then((data) => data.json())

	for (let i = 0; i < feed.Feed.length; i++) {
		placeFeedItem(newFeedItem(feed.Feed[i]))
	}

	if (document.querySelector(".column") != null) {
		document.querySelector(".column").id = "first"
	}
}

window.onload = async () => {
	isMobile = mobileCheck()

	document.getElementById("refresh").onclick = async () => {
		fetchFeed()
	}

	document.getElementById("post").onclick = () => {
		window.open("/post/new", "_self")
	}

	document.getElementById("view-archive").onclick = () => {
		window.open("/archive", "_self")
	}
	fetchFeed()

	if (isMobile) {
		document.getElementById("version").id = "version-mobile"
	}
}