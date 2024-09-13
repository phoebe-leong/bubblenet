const CHARACTERLIMIT = 650
const REDZONE = 20

window.onload = () => {
	const counter = document.getElementById("character-amnt")
	const textarea = document.querySelector("textarea")

	counter.innerHTML = `0/${CHARACTERLIMIT}`
	textarea.addEventListener("input", () => {
		counter.innerHTML = `${textarea.value.length}/${CHARACTERLIMIT}`

		if (textarea.value.length >= CHARACTERLIMIT - REDZONE) {
			counter.style.color = "red"
		} else if (counter.style.color == "red" && textarea.value.length < CHARACTERLIMIT - REDZONE) {
			counter.style.color = "black"
		}
	})
}