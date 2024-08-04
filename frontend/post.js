function unixTimestampToReadableDate(timestamp) {
	const dayTable = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
	const monthTable = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	const date = new Date(timestamp * 1000)
	const locale = date.toLocaleString()
	const splitDate = locale.split('/')
	const yearAndTimeSplit = splitDate[2].split(',')

	const readable = {
		day: dayTable[date.getDay()],
		date: (splitDate[0][0] === '0') ? splitDate[0][1] : splitDate[0],
		month: monthTable[parseInt(splitDate[1]) - 1],
		year: yearAndTimeSplit[0],
		time: {
			hour: (parseInt((yearAndTimeSplit[1]).split(':')[0])) % 12 || 12,
			minute: yearAndTimeSplit[1].split(':')[1]
		}
	}
	readable.time.meridian = (readable.time.hour >= 12) ? "pm" : "am"

	console.log()

	return `${readable.time.hour}:${readable.time.minute}${readable.time.meridian} ${readable.day}, ${readable.month} ${readable.date}, ${readable.year}`
}

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
	document.getElementById("unix-time").innerHTML = `Posted: ${unixTimestampToReadableDate(data.unixTimestamp)}`
	document.getElementById("post-id").innerHTML = `Post Id: ${id}`

	document.body.appendChild(container)

	document.getElementById("version").style.paddingBottom = "12px"
}