const express = require("express")
const jsonfile = require("jsonfile")

const app = express()

const PORT = 8000
const CHARACTERLIMIT = 650
const FEEDLIMIT = 30
const WINCHECKFALSE = (process.platform != "win32")

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
	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)
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
	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)

	for (let i = 0; i < file.Messages.length; i++) {
		Ids.push(file.Messages[i].id)
	}
}

const logger = (req, res, next) => {
	console.log(req.url)
	next()
}
app.use(logger)

const notfound = (req, res, next) => {
	res.status(404).sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/notfound.html` : `${__dirname}\\frontend\\notfound.html`)
}
const servererror = (err, req, res, next) => {
	res.status(err.status || 500)
	if (app.get("env") === "development") {
		res.send(JSON.stringify({
			error: err,
			message: err.message
		}))
	} else {
		res.send(JSON.stringify({
			error: "",
			message: err.message
		}))
	}
}

app.use("/", express.static("frontend/public"))
app.use("/data", express.static("storage"))

app.get("/feed", (req, res) => {
	res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/feed.html` : `${__dirname}\\frontend\\feed.html`)
})

app.get("/archive", (req, res) => {
	res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/archive.html` : `${__dirname}\\frontend\\archive.html`)
})

app.get("/post/new", (req, res) => {
	res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/new-post.html` : `${__dirname}\\frontend\\new-post.html`)
})

app.get("/data/feed.json", (req, res) => {
	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)
	const fileLength = file.Messages.length - 1

	let feed = {Feed: []}

	for (let i = fileLength; fileLength - i != FEEDLIMIT && i != -1; i--) {
			feed.Feed.push(file.Messages[i])
	}
	res.send(feed)
})

app.get("/data/archive.json", (req, res) => {
	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)
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
		const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)

		for (let i = 0; i < file.Messages.length; i++) {
			if (file.Messages[i].id === req.params.id) {
				res.send(file.Messages[i])
			}
		}
	}
})

app.get("/post/:id", (req, res) => {
	if (isIdValid(req.params.id)) {
		res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/post.html` : `${__dirname}\\frontend\\post.html`)
	} else {
		res.status(404).sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/notfound.html` : `${__dirname}\\frontend\\notfound.html`)
	}
})

app.get("/data/subheader.txt", (req, res) => {
	res.sendFile((WINCHECKFALSE) ? `${__dirname}/storage/subheader.txt` : `${__dirname}\\storage\\subheader.txt`)
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

	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)
	var message = req.body

	let id = ""
	while (id == "" || !isIdUnique(id)) {
		id = generateId()
	}

	message.id = id
	message.unixTimestamp = Math.trunc(Date.now() / 1000)

	file.Messages.push(message)
	jsonfile.writeFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`, file)

	Ids.push(message.id)
	res.send()
})
app.use(notfound)
app.use(servererror)

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})