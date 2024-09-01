async function applyChanges() {
	const subheaderInput = document.getElementById("subheaderInput").value
	const pinAdd = document.getElementById("pinAdd").value
	const pinRemove = document.getElementById("pinRemove").value

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
	location.reload()
}

window.onload = async () => {
	const ip = await fetch("/data/ip.txt")
		.then((data) => data.text())
	document.getElementById("serverIP").innerHTML += ip
}