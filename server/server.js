const fs = require('fs')
const path = require('path')


const SERVER_SECRET = require("./server-secret.js")
const fetch = require('node-fetch')

const apicache = require('apicache')
//let cache = apicache.middleware

const proxy = require('express-http-proxy')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const Papa = require('papaparse')
const app = express()
const port = 8080

const POSTS_DATABASE = 'data/posts.csv'
const ITEMS_DATABASE = 'data/items.csv'


//let's add some basic auth
app.use(basicAuth({
	users: {[SERVER_SECRET.username]: SERVER_SECRET.password},
	challenge: true

}))

// for parsing application/json
app.use(bodyParser.json()); 


//return items
app.get('/api/items', function (req, res) {

	let site = req.query.site ? req.query.site : ""

	let query = `site=${site}`

	if (itemsByQuery[query])
		res.json(itemsByQuery[query])

	else {
		res.status('404')
		res.send(`No items found for query ${query}`)
	}
})

//return posts with market promos
app.get('/api/posts', function (req, res) {
	res.send(posts)
})

//in dev mode, we just proxy the dev server
//in production mode, we should serve the static assets instead
//app.all('*', proxy('localhost:3000'))

app.use(express.static('build'));

app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, '../build/index.html'))
}) //express.static('build'))


app.listen(port, () => console.log(`API app listening on port ${port}!`))


let posts = []

//stream in the database
function loadPostsDatabase() {
	if (fs.existsSync(POSTS_DATABASE)) {
		const dataFileStream = fs.createReadStream(POSTS_DATABASE)
		const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
			dynamicTyping: true,
			header: true,
		})

		//only load the posts that link to market items
		dataPapaStream.on('data', (post) => { 
			if (post.market_items) posts.push(post) 
		})
		dataPapaStream.on('end', () => {
			//filter posts for unique values
			let uniquePosts = {}
			posts.forEach(post => uniquePosts[post.url] = post)
			posts = Object.values(uniquePosts)
			console.log("Loaded "+posts.length+ " posts from the database")
		})
		dataFileStream.pipe(dataPapaStream)
	}
	else {
		console.log(`Database ${POSTS_DATABASE} does not exist`)
		exit(1)
	}
}

let itemsByQuery = {}

//stream in the database
function loadItemsDatabase() {
	if (fs.existsSync(ITEMS_DATABASE)) {
		const dataFileStream = fs.createReadStream(ITEMS_DATABASE)
		const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
			dynamicTyping: true,
			header: true,
		})

		//only load the posts that link to market items
		dataPapaStream.on('data', (item) => {
			if (itemsByQuery[item.query]) 
				itemsByQuery[item.query].push(item)
			else
				itemsByQuery[item.query] = [item]

		})
		dataPapaStream.on('end', () => {
			//filter posts for unique values
			console.log(`Loaded ${Object.values(itemsByQuery).reduce((acc,cur) =>acc+cur.length, 0)} posts from the database`)
		})
		dataFileStream.pipe(dataPapaStream)
	}
	else {
		console.log(`Database ${ITEMS_DATABASE} does not exist`)
		exit(1)
	}
}

loadPostsDatabase()
loadItemsDatabase()