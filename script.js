let dialogs = []

function createDialogs() {
	const imgSrcs = ["feed.png", "archive.png", "new-post.png", "light-mode.png", "post.png"]

	for (const i in imgSrcs) {
		const dialog = document.createElement("dialog")
		const img = document.createElement("img")
			img.src = `media/${imgSrcs[i]}`

		dialog.addEventListener("close", () => {
			document.body.style.overflow = "auto"
		})

		dialog.addEventListener("click", e => {
			if (event.target.tagName != "IMG") {
				dialog.close()
			}
		})

		dialog.appendChild(img)
		document.body.appendChild(dialog)
		dialogs.push(dialog)
	}
}

function showDialog(index) {
	dialogs[index].showModal()
	document.body.style.overflow = "hidden"
}

createDialogs()