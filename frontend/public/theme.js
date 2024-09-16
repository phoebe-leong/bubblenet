function setTheme() {
	const theme = localStorage.getItem("theme")
	document.querySelector("html").id = `${theme}-theme`
}

function addListener() {
	document.getElementById("theme-btn").addEventListener("click", () => {
		const theme = localStorage.getItem("theme")

		if (theme == "light") {
			localStorage.setItem("theme", "dark")
		} else {
			localStorage.setItem("theme", "light")
		}
		setTheme()

		console.log("yeahhh")
	})
	console.log("worked")
}

setTheme()
addListener()