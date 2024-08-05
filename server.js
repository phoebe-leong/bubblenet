const express = require("express")
const jsonfile = require("jsonfile")

const app = express()

const PORT = 8000
const CHARACTERLIMIT = 650
const FEEDLIMIT = 30

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

function isIdValid(id) {
	const file = jsonfile.readFileSync("./storage/messages.json")
	let found = false

	for (let i = 0; i < file.Messages.length; i++) {
		if (file.Messages[i].id === id) {
			found = true
			break
		}
	}
	return found
}

{
	const file = jsonfile.readFileSync("./storage/messages.json")

	for (let i = 0; i < file.Messages.length; i++) {
		Ids.push(file.Messages[i].id)
	}
}

const logger = (req, res, next) => {
	console.log(req.url)
	next()
}
//app.use(logger)

app.use("/", express.static("frontend"))
app.use("/data", express.static("storage"))

app.get("/feed", (req, res) => {
	res.sendFile(`${__dirname}/feed.html`)
})

app.get("/archive", (req, res) => {
	res.sendFile(`${__dirname}/archive.html`)
})

app.get("/post/new", (req, res) => {
	res.sendFile(`${__dirname}/new-post.html`)
})

app.get("/data/feed.json", (req, res) => {
	const file = jsonfile.readFileSync("./storage/messages.json")
	const fileLength = file.Messages.length - 1

	let feed = {Feed: []}

	for (let i = fileLength; fileLength - i != FEEDLIMIT && i != -1; i--) {
			feed.Feed.push(file.Messages[i])
	}
	res.send(feed)
})

app.get("/data/archive.json", (req, res) => {
	const file = jsonfile.readFileSync("./storage/messages.json")
	const fileLength = file.Messages.length - 1

	let archive = {Archive: []}

	let j = 0
	for (let i = fileLength + 1; i != -1; i--) {
		if (j > FEEDLIMIT) {
			archive.Archive.push(file.Messages[i])
		}
		j++
	}
	res.send(archive)
})

app.get("/data/:id.json", (req, res) => {
	res.setHeader("Content-Type", "application/json")

	if (!isIdValid(req.params.id)) {
		res.send(JSON.stringify({
			"errorCode": 400,
			"errorMessage": "Invalid post id"
		}))
	} else {
		const file = jsonfile.readFileSync("./storage/messages.json")

		for (let i = 0; i < file.Messages.length; i++) {
			if (file.Messages[i].id === req.params.id) {
				res.send(file.Messages[i])
			}
		}
	}
})

app.get("/post/:id", (req, res) => {
	if (isIdValid(req.params.id)) {
		res.sendFile(`${__dirname}/post.html`)
	} else {
		res.status(404).send("Post not found")
	}
})

app.get("/data/subheader.txt", (req, res) => {
	res.sendFile(`${__dirname}/storage/subheader.txt`)
})

app.use(express.json())
app.post("/data/messages.json", (req, res) => {

	if (req.body.content == null || req.body.hasMedia == null || req.body.mediaLink == null) {
		res.status(400).send("Missing required JSON keys")
		return
	} else if (req.body.content.length > CHARACTERLIMIT) {
		res.status(400).send("Textual content exceeds defined character limit")
		return
	}

	const file = jsonfile.readFileSync("./storage/messages.json")
	var message = req.body

	let id = ""
	while (id == "" || !isIdUnique(id)) {
		id = generateId()
	}

	message.id = id
	message.unixTimestamp = Math.trunc(Date.now() / 1000)

	file.Messages.push(message)
	jsonfile.writeFileSync("./storage/messages.json", file)

	Ids.push(message.id)
	res.send()
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})