async function applyChanges() {
	const subheaderInput = document.getElementById("subheaderInput").value
	const pinAdd = document.getElementById("pinAdd").value
	const pinRemove = document.getElementById("pinRemove").value
	const imgurClient = document.getElementById("imgurClient").value

	const bannedWords = document.getElementById("bannedWords").value
	const bannedWordsChar = document.getElementById("bannedWordsChar").value

	const storageOn = document.getElementById("storageOn").checked
	const storageOff = document.getElementById("storageOff").checked

	if (pinAdd != "") {
		await fetch("/data/pinned.json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				action: "add",
				pins: pinAdd.split(','),
			})
		})
	}

	if (pinRemove != "") {
		await fetch("/data/pinned.json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				action: "remove",
				pins: pinRemove.split(",")
			})
		})
	}

	if (subheaderInput != "") {
		await fetch("/data/subheader.txt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				subheader: subheaderInput
			})
		})
	}

	if (imgurClient || storageOn || storageOff || bannedWords || bannedWordsChar) {
		let localStorageOn
		if (storageOn && !storageOff) { localStorageOn = true }
		else { localStorageOn = false }

		await fetch("/data/serverconfig.json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				imgurClientId: imgurClient,
				localImageStorage: localStorageOn,
				bannedWords: bannedWords,
				bannedWordsCensor: bannedWordsChar
			})
		})
	}

	alert("Changes saved")
	location.reload()
}

async function nuke() {
	if (confirm("Are you sure you want to delete ALL posts?\nThis is IRREVERSABLE. All posts will be deleted FOREVER.")) {
		await fetch("/data/messages.json", {
			method: "DELETE"
		})
		alert("All posts deleted.")
	}
}

window.onload = async () => {
	const ip = await fetch("/data/ip.txt")
		.then((data) => data.text())
	document.getElementById("serverIP").innerHTML += ip

	const config = await fetch("/data/serverconfig.json")
		.then((data) => data.json())
	const localStorageOn = (config.localImageStorage) ? "ON" : "OFF"

	document.getElementById("localStorageLabel").innerHTML = `Local Image Storage is <strong>${localStorageOn}</strong>. Changes will come into effect after server restart.`
	if (localStorageOn == "ON") {
		document.getElementById("storageOn").checked = true
	} else {
		document.getElementById("storageOff").checked = true
	}
}