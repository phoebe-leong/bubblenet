window.onload = async () => {
	let req = await fetch("http://127.0.0.1:8000/data/messages.json")
		.then((data) => data.json())
		.then((json) => console.log(json))
}