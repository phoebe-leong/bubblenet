const express = require("express")
const jsonfile = require("jsonfile")
const app = express()

const PORT = 8000
const Ids = []

function generateId() {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_=+"
	let id = ""

	for (let i = 0; i < 11; i++) {
		id += characters[Math.floor(Math.random() * characters.length)]
	}
	return id
}

function isIdUnique(id) {
	for (let i = 0; i < Ids.length; i++) {
		if (id == Ids[i]) {
			return false
		}
	}
	return true
}

{
	const file = jsonfile.readFileSync("./storage/messages.json")

	for (let i = 0; i < file.Messages.length; i++) {
		Ids.push(file.Messages[i].id)
	}
}

app.use("/", express.static("frontend"))
app.use("/data", express.static("storage"))

app.use(express.json())

app.post("/data/messages.json", (req, res) => {
	const file = jsonfile.readFileSync("./storage/messages.json")
	var message = req.body

	let id = ""
	while (id == "" || !isIdUnique(id)) {
		id = generateId()
	}

	message.id = id
	message.unixTimestamp = Date.now()

	file.Messages.push(message)
	jsonfile.writeFileSync("./storage/messages.json", file)

	Ids.push(message.id)
})

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})