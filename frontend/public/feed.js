function newFeedItem(data) {
	const characterLimit = (!isMobile) ? 45 : 55
	const oneLineLength = (!isMobile) ? 25 : 44
	let shortenedText = data.content.replace(/<\/?[^>]+(>|$)/g, "")

	if (shortenedText.length > characterLimit) {
		while (shortenedText.length != characterLimit) {
			shortenedText = shortenedText.slice(0, -1)
		}
		shortenedText = `${shortenedText}...`
	}

	const container = document.createElement("div")
		container.classList.add("feed-item")
		container.onclick = () => {
			window.open(`/post/${data.id}`, "_self")
		}
	const img = document.createElement("img")
		img.src = (data.hasMedia) ? data.mediaLink : "/media/image-placeholder.png"
	const text = document.createElement("p")
		text.innerHTML = shortenedText
		text.classList.add("montserrat-regular")

	container.appendChild(img)
	container.appendChild(text)
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

	if (feed.Feed.length == 0) {
		const noFeed = document.createElement("p")
			noFeed.id = "noFeed"
			noFeed.classList.add("montserrat-regular")
			noFeed.innerHTML = "There are no posts to show. Try <a href='/post/new'>creating one</a>."
		document.getElementById("feed").appendChild(noFeed)

		document.getElementById("version-feed").id = "version"
		document.getElementById("feed").style.display = "initial"
	}

	for (let i = 0; i < feed.Feed.length; i++) {
		placeFeedItem(newFeedItem(feed.Feed[i]))
	}
}

async function addPins() {
	const pinned = await fetch("/data/pinned.json")
		.then((data) => data.json())

	if (pinned.Pinned.length == 0) {
		const noPins = document.createElement("p")
			noPins.classList.add("montserrat-regular")
			noPins.innerHTML = "There are no pinned posts to show."

		document.getElementById("pinned").appendChild(noPins)
	} else {

		for (let i = pinned.Pinned.length - 1; i > -1; i--) {
			const itemData = await fetch(`/data/${pinned.Pinned[i]}.json`)
				.then((data) => data.json())
			const item = newFeedItem(itemData)

			document.getElementById("pinned").appendChild(item)
		}
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
	addPins()

	if (isMobile) {
		document.getElementById("version-feed").id = "version-mobile"
	}
}