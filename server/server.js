const fs = require('fs')
const path = require('path')


const ENVATO_API_SECRET = require("./envato-secret.js")
const fetch = require('node-fetch')

const headers = {Authorization: "Bearer "+ENVATO_API_SECRET.token}

const apicache = require('apicache')
let cache = apicache.middleware

const proxy = require('express-http-proxy')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const Papa = require('papaparse')
const app = express()
const port = 8080

const POSTS_DATABASE = 'data/posts.csv'


//let's add some basic auth
app.use(basicAuth({
	users: {[ENVATO_API_SECRET.username]: ENVATO_API_SECRET.password},
	challenge: true

}))

// for parsing application/json
app.use(bodyParser.json()); 


//this is just a gateway to the envato api
//not very secure!
//it should only pass on recognized parameters to the api 
//also this is 0% error tolerant
app.get('/api/items', cache('6 hours'), function (req, res) {

	//params are decoded from request into req.params
	//re-encode these
	
	const paramsString = req.url.match(/\?(.*)/)[1]
	const url = `https://api.envato.com/v1/discovery/search/search/item?${paramsString}`

	fetch(url, {headers})
	.then( apiRes => {
		res.status(apiRes.status)
				
		return apiRes.json()
	})
	.then (json => res.send(json))

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
function loadDatabase() {
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


loadDatabase()