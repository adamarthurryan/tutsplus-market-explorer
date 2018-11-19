const fs = require('fs')
const SemrushSecret = require('./secret/semrush-secret')
const dateFormat = require('dateformat')
const fetch = require('node-fetch')
const {delay} = require('./util/scraper.js')
const Semrush = require('./util/semrush-api-async')
const asyncPool = require('tiny-async-pool')
const loadPostsDatabase = require('./util/loadPostsDatabase')
const loadItemsDatabase = require('./util/loadItemsDatabase')

const Papa = require('papaparse')

const POST_OUTPUT_FILE = "data/posts-sem.csv"
const ITEM_OUTPUT_FILE = "data/items-sem.csv"



function createOutput(filename) {
	console.log(`Create output file: ${filename}`)

	return fs.createWriteStream(filename, {
	  flags: 'w' // open the file for writing
	})
}

var sem = new Semrush({
	apiKey: SemrushSecret.apiKey,
	debug: false //optional
});


const transformSemrushHeaders = (fieldNames) => {
	const fieldMap = {}
	fieldNames.forEach(name => 
		fieldMap[name] = name.toLowerCase().replace(/[(%).\r]/g, "").replace(/  /g, " ").trim().replace(/ /g, "_")
	)

	return (record) => {
		newRecord = {}
		Object.keys(record).forEach(name => newRecord[fieldMap[name]]=record[name])
		return newRecord
	}
}

function parseSemrushResults(text) {
	const errorMatch = text.match(/ERROR :: (.*)/)
	if (errorMatch)
		throw new Error("Error retrieving Semrush data: "+errorMatch[1])
	
	const parsed = Papa.parse(text, {
		header: true,
		delimiter: ';',
	})

	const headerTransformer = transformSemrushHeaders(parsed.meta.fields)
	const transformedData = parsed.data.map(headerTransformer)


	return transformedData
}

async function getUrlSemrushData(url) {
	let results = await sem.urlOrganic({
			url: url,
			display_limit: 10,
			database: 'us'
		})
	return parseSemrushResults(results)
}

async function scrapeSemrushData(output, url, query, count, i, isFirstObj) {
	let data = await getUrlSemrushData(url)

	data.forEach((dataLine, idx) => {
		if (query)
			dataLine.query = query
		dataLine.url = url
		dataLine.position = idx

	})

	//do something with the data

	if (data.length>0) {
		//render these items as CSV with papaparse
		//only output the header for the first block of items
		const csv = Papa.unparse(data, {
			header:isFirstObj.value,
			delimiter: Papa.RECORD_SEP,
			quoteChar: '\''
		})
		output.write(csv+'\r\n')
	}
	
	isFirstObj.value=false
	process.stdout.write(`Retrieved ${i} of ${count}\r`);
}


async function scrapePostsSemrushData(posts) {
	console.log(`Collecting Semrush data for ${posts.length} posts`)
	let output = createOutput(POST_OUTPUT_FILE)

	const count=posts.length
	let i=0
	let isFirstObj = {value:true}

	await asyncPool(10, posts, post=>scrapeSemrushData(output, post.url, undefined, count, i++, isFirstObj))
}


async function scrapeItemsSemrushData(itemsByQuery) {
	let output = createOutput(ITEM_OUTPUT_FILE)
	for (query in itemsByQuery) {
		let isFirstObj={value:true}
		const count=itemsByQuery[query].length
		let i=0
		console.log(`Collecting Semrush data for ${count} items with query ${query}`)
		await asyncPool(10, itemsByQuery[query], item=>scrapeSemrushData(output, item.url, query, count, i++, isFirstObj))
	}
}

async function main() {
	let posts = await loadPostsDatabase()
	let itemsByQuery = await loadItemsDatabase()

	await scrapePostsSemrushData(posts)
	await scrapeItemsSemrushData(itemsByQuery)
}

main()

/*
async function test() {
	console.log(await sem.urlOrganic({
		url: 'https://code.tutsplus.com/tutorials/20-best-jquery-image-sliders--cms-25960',
		display_limit: 20,
		database: 'us'
	}))
}

test()
*/