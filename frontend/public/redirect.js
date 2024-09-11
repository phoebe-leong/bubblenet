const PORT = 8000

if (window.location.host == `127.0.0.1:${PORT}` || window.location.host == `[::1]:${PORT}`) {
	window.location.href = `http://localhost:${PORT}${window.location.pathname}`
}