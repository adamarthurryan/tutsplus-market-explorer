
const Papa = require("papaparse")
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')

//options for papa parse
const papaOptions = {
	dynamicTyping: true,
	header: true
}


const NUM_PAGES = 500
const BASE_URL = "https://tutsplus.com/tutorials"
const PAGE_DELAY = 100

const OUTPUT_FILE = "./data/posts.csv"

const ITEM_LINK_REGEX = /https:\/\/(codecanyon|photodune|themeforest|videohive|audiojungle|graphicriver|3docean).net\/item\/[^"'?]+/g
const ITEM_REGEX = /\d+$/


//the collected scraped posts
let posts = []

let isFirst = true

let output = null

function createOutput() {
	console.log(`Create output file: ${OUTPUT_FILE}`)

	output = fs.createWriteStream(OUTPUT_FILE, {
	  flags: 'w' // open the file for writing
	})
}

function scrape() {
	console.log(`Scraping ${NUM_PAGES} pages of posts with a ${PAGE_DELAY} ms delay`)

	//populate an array with page suffixes which will be appended to the tutorials index page urls 
	const indexPageSuffixes = Array(NUM_PAGES).fill().map((_, idx) => idx>1 ? `?page=${idx}` : "")
	const indexPageUrls = indexPageSuffixes.map(suffix => BASE_URL+suffix)
	
	//for each index page, fetch that page and pass its body off for processing
	//!!! error handling?
	//also, slow down the fetching of each page with a timeout
/*	indexPageUrls.forEach((url, idx) =>
		setTimeout( () => 
			fetchWithRetry(url)
				.then(html => processIndexPage(html))
				.catch(error => console.log(`Fetch error: ${error}`))
			, idx * PAGE_DELAY
		)
	)
*/
	fetchPage(indexPageUrls, 0)
}

//fetch the pages in sequence
async function fetchPage (urls, index) {
	const url = urls[index]

	fetchWithRetry(url)
		.then(html => processIndexPage(html))
		.then( () => (index < urls.length) ?
			delay(PAGE_DELAY).then(() => fetchPage(urls, index+1))
			: Promise.resolve()
		)
		.catch(error => console.log(`Fetch error: ${error}`))
}


async function fetchWithRetry(url) {
	return fetch(url)
		.then(response => {
			if (response.ok)
				return response.text()
			else {
				console.log(`Fetch received ${response.status} for ${url}`)
				if (response.status === 429) {

					let retryAfter = response.headers.has("retry-after") ? 
						parseInt(response.headers.get("retry-after")) 
						: 300
					retryAfter += 1
					console.log(`Retrying after ${retryAfter} seconds`)
					return delay(retryAfter*1000).then(() => fetchWithRetry(url))
				}
				else if (response.status === 504) {
					console.log("Gateway timeout, retrying in 10 seconds")
					return delay(10*1000).then(() => fetchWithRetry(url))
				}
				else
					return Promise.resolve()
			}
		})	
}

//from https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
async function delay(t, v) {
   return new Promise(function(resolve) { 
       setTimeout(resolve.bind(null, v), t)
   });
}


function processIndexPage(html) {
	let $ = cheerio.load(html)

	let posts = $(".posts__post")

	posts.children().each( (idx, post) => {
		let title = $(".posts__post-title h1", post).text()
		let publication_date = $(".posts__post-publication-date", post).text()
		let author = $(".posts__post-author-link", post).text()
		let url = $(".posts__post-title", post).attr('href')
		let primary_topic = $(".posts__post-primary-topic-link", post).text()
		let primary_category = $(".posts__post-primary-category-link", post).text()
		let teaser = $(".posts__post-teaser", post).text()

		scrapePost({title, publication_date, author, url, primary_topic, primary_category, teaser})
	})
}

async function scrapePost(post) {
	return fetchWithRetry(post.url)
		.then(html => processPost(post, html))
		.catch(error => console.log(`Fetch error: ${error}`))
}


function processPost(post, html) {
	let links = html.match(ITEM_LINK_REGEX)
	if (links) 
		links = links.map( link => link.match(ITEM_REGEX)[0] )
	else 
		links = []

	//make links unique
	let linkSet = {}
	links.forEach(link => linkSet[link]=link)
	links = Object.keys(linkSet)

	post.market_items = links

	posts.push(post)


	//render the post as a line of CSV with papaparse
	//only output the header on the first line
	const csv = Papa.unparse([post], {header:isFirst})
	output.write(csv+'\n')

	isFirst=false
}

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

function main() {
	loadDatabase()
	createOutput()
	scrape()
}

main()

/*


fetch code.tutsplus.com/tutorials
	parse
	scan for posts
		scrape post info
		fetch posts
			scrape links
	scan for next page
*/