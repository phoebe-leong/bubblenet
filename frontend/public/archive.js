function newArchiveItem(data) {
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
		container.classList.add("archive-item")
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

function placeArchiveItem(item) {
	if (!isMobile) {
		const sections = document.getElementById("archive").children

		for (let i = 0; i < sections.length; i++) {
			const columns = sections[i].children

			for (let j = 0; j < columns.length; j++) {
				if ((columns[j].children).length < 6) {
					columns[j].appendChild(item)
					return
				}
			}

			if (columns.length < 5) {
				const column = document.createElement("div")
					column.classList.add("column")

				column.appendChild(item)
				sections[i].appendChild(column)
				return
			}
		}

		const section = document.createElement("section")
		const column = document.createElement("div")
			column.classList.add("column")

		column.appendChild(item)
		section.appendChild(column)

		document.getElementById("archive").appendChild(section)
	} else {
		document.getElementById("archive").appendChild(item)
	}
}

async function fetchArchive() {
	if (document.querySelector("section") != null) {
		const sections = Array.prototype.slice.call(document.getElementById("archive").children)

		for (let i = 0; i < sections.length; i++) {
			sections[i].remove()
		}
	}

	const archive = await fetch("/data/archive.json")
		.then((data) => data.json())

	if (archive.Archive.length == 0) {
		const noArchive = document.createElement("p")
			noArchive.id = "noArchive"
			noArchive.innerHTML = "There are no archived posts to show."
		document.getElementById("archive").appendChild(noArchive)

		document.getElementById("version-archive").id = "version"
	} else {
		for (let i = 0; i < archive.Archive.length; i++) {
			placeArchiveItem(newArchiveItem(archive.Archive[i]))
		}
	}
}

window.onload = async () => {
	document.getElementById("refresh").onclick = async () => {
		fetchArchive()
	}
	fetchArchive()

	isMobile = mobileCheck()
}