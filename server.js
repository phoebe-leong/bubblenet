const express = require("express")
const jsonfile = require("jsonfile")
const multer = require("multer")
const fs = require("fs")

const app = express()

const multerstorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${__dirname}/storage/images`)
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({storage: multerstorage})

const PORT = 8000
const CHARACTERLIMIT = 650
const FEEDLIMIT = 30
const WINCHECKFALSE = (process.platform != "win32")

const Ids = []

// From detectmobilebrowsers.com
function isMobile (req) {
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(req.headers['user-agent'])||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(req.headers['user-agent'].substr(0,4))) {
		return true
	}
	return false
}

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
//app.use(logger)

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

app.get("/style.css", (req, res) => {
	if (!isMobile(req)) {
		res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/public/style.css` : `${__dirname}\\frontend\\public\\style.css`)
	} else {
		res.sendFile((WINCHECKFALSE) ? `${__dirname}/frontend/mobile.css` : `${__dirname}\\frontend\\mobile.css`)
	}
})

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

app.post("/data/messages.json", upload.single("mediaFile"), (req, res) => {
	if (req.body.content == null || req.body.hasMedia == null || req.body.mediaLink == null) {
		res.status(400).send("Missing required items")

		fs.unlinkSync(`${__dirname}/storage/images/${req.file.originalname}`)
		return
	} else if (req.body.content.length > CHARACTERLIMIT) {
		res.status(400).send("Textual content exceeds defined character limit")

		fs.unlinkSync(`${__dirname}/storage/images/${req.file.originalname}`)
		return
	}

	let id = ""
	while (id == "" || !isIdUnique(id)) {
		id = generateId()
	}
	fs.renameSync(`${__dirname}/storage/images/${req.file.originalname}`, `${__dirname}/storage/images/${id}.${req.file.originalname.split('.')[1]}`)

	const file = jsonfile.readFileSync((WINCHECKFALSE) ? "./storage/messages.json" : `${__dirname}\\storage\\messages.json`)
	var message = req.body

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