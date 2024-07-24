const express = require("express")
const app = express()

const PORT = 8000

app.use("/", express.static("frontend"))
app.use("/data", express.static("storage"))

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})