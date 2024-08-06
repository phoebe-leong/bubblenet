async function subheader() {
	const subheader = await fetch("/data/subheader.txt")
		.then((data) => data.text())

	document.getElementById("subheader").innerHTML = subheader
}
subheader()