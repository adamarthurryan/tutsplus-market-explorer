
const Papa = require("papaparse")
const fetch = require('node-fetch')
const fs = require('fs')

const envatoAPI = require('./util/envatoAPI')


const {delay, fetchWithRetry, fetchUrls} = require('./util/scraper')

const ENVATO_API_SECRET = require("./secret/envato-secret.js")
const envatoApiHeaders = {Authorization: "Bearer "+ENVATO_API_SECRET.token}

const OUTPUT_FILE = "./data/items.csv"

//the collected scraped items
let items = []

let isFirst = true

let output = null

function createOutput() {
	console.log(`Create output file: ${OUTPUT_FILE}`)

	output = fs.createWriteStream(OUTPUT_FILE, {
	  flags: 'w' // open the file for writing
	})
}

const sites = ['', 'codecanyon.net', 'videohive.net', "graphicriver.net", "themeforest.net", "3docean.net", "photodune.net", "audiojungle.net"]

const NUM_PAGES = 60

function scrape() {
	console.log(`Querying ${NUM_PAGES} pages of items`)


	let pageNums = Array(NUM_PAGES).fill().map((_, idx) => idx)
	let urlsBySite = sites.map(site => ({
		site:site,
		urls:pageNums.map(num => envatoAPI.getItemSearchString(site, num+1))
	}))
	
	urlsBySite.forEach(({site, urls}) => {
		console.log(`Fetching items for ${site ? site : 'all sites'}...`)
		fetchUrls(urls, 0, processResults(site), envatoApiHeaders)
	})
}


const fields = ['id','name','description','site','classification','price_cents','number_of_sales','author_username','url','rating','updated_at','published_at','trending','key_features','image_urls','tags']
const DATE_REGEX = /\d\d\d\d-\d\d-\d\d/

const processResults = (site) => (text) => {


	let data = JSON.parse(text)

	let items = data.matches.map( (rawItem) => {
		let item = {}

		//some items actually have the delimiter character in their description!
		if (item.description)
			item.description.replace('\u001e', '\n')

		item.query = `site=${site}`

		fields.forEach(field=>item[field]=rawItem[field])

		item.rating = JSON.stringify(item.rating)
		item.updated_at = item.updated_at.match(DATE_REGEX)[0]
		item.published_at = item.published_at.match(DATE_REGEX)[0]
		//item.previews = JSON.stringify(item.previews)



		return item
	})


	console.log(`Received ${items.length} items for ${site}`)


	//render these items as CSV with papaparse
	//only output the header for the first block of items
	const csv = Papa.unparse(items, {
		header:isFirst,
		delimiter: Papa.RECORD_SEP,
		quoteChar: '\''
	})
	output.write(csv+'\r\n')

	isFirst=false
}


function main() {
	createOutput()
	scrape()
}

main()

