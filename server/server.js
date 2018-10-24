

const ENVATO_API_SECRET = require("./envato-secret.js")
const fetch = require('node-fetch')

const headers = {Authorization: "Bearer "+ENVATO_API_SECRET.token}


const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

// for parsing application/json
app.use(bodyParser.json()); 

//this is just a gateway to the envato api
//not very secure! 
// !!! fix this with request origin control

//also this is 0% error tolerant
app.get('/items', function (req, res) {

	//params are decoded from request into req.params
	//re-encode these
	
	const paramsString = req.url.match(/\?(.*)/)[1]
	const url = `https://api.envato.com/v1/discovery/search/search/item?${paramsString}`

	fetch(url, {headers})
	.then( apiRes => {
		res.status(apiRes.status)
		
		//!!! Again, not secure, should have better origin control
		res.set('Access-Control-Allow-Origin', '*')
		
		return apiRes.json()
	})
	.then (json => res.send(json))

})

app.listen(port, () => console.log(`API app listening on port ${port}!`))
