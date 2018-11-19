const fs = require('fs')
const path = require('path')


const SERVER_SECRET = require("./secret/server-secret.js")
const fetch = require('node-fetch')

const apicache = require('apicache')
//let cache = apicache.middleware

const proxy = require('express-http-proxy')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const Papa = require('papaparse')

const loadPostsDatabase = require('./util/loadPostsDatabase')
const loadItemsDatabase = require('./util/loadItemsDatabase')
const loadPostsSemrushDatabase = require('./util/loadPostsSemrushDatabase')
const loadItemsSemrushDatabase = require('./util/loadItemsSemrushDatabase')

const app = express()
const port = 8080


let	posts
let	itemsByQuery
let	semrushByPost
let	semrushByQueryAndItem


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


//return semrush data for items
app.get('/api/sem/items', function (req, res) {

	let site = req.query.site ? req.query.site : ""

	let query = `site=${site}`

	if (semrushByQueryAndItem[query])
		res.json(semrushByQueryAndItem[query])

	else {
		res.status('404')
		res.send(`No items found for query ${query}`)
	}
})

//return semrush data for posts
app.get('/api/sem/posts', function (req, res) {
	res.send(semrushByPost)
})

//in dev mode, we just proxy the dev server
//in production mode, we should serve the static assets instead
//app.all('*', proxy('localhost:3000'))

app.use(express.static('build'));

app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, '../build/index.html'))
}) //express.static('build'))




async function launch() {
	posts = await loadPostsDatabase()
	itemsByQuery = await loadItemsDatabase()
	semrushByPost = await loadPostsSemrushDatabase()
	semrushByQueryAndItem = await loadItemsSemrushDatabase()

	app.listen(port, () => console.log(`API app listening on port ${port}!`))
}

launch()