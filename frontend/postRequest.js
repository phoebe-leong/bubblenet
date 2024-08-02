window.onload = async () => {
	const id = window.location.pathname.split('/')[2]
	console.log(id)

	const data = await fetch(`http://127.0.0.1:8000/data/${id}.json`)
		.then((data) => data.json())
}