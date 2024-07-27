window.onload = async () => {
	await fetch("http://127.0.0.1:8000/data/messages.json", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			content: "Hello, World!",
			hasMedia: false,
			mediaLink: ""
		})
	})
}