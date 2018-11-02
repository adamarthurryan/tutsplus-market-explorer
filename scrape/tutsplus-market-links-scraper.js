
const Papa = require("papaparse")
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')

//options for papa parse
const papaOptions = {
	dynamicTyping: true,
	header: true
}

const {delay, fetchWithRetry, fetchUrls} = require('./scraper')


const NUM_PAGES = 500
const BASE_URL = "https://tutsplus.com/tutorials"

const OUTPUT_FILE = "./data/posts.csv"

const ITEM_LINK_REGEX = /https:\/\/(codecanyon|photodune|themeforest|videohive|audiojungle|graphicriver|3docean).net\/item\/[^"'?]+/g
const ITEM_REGEX = /\d+$/

const POSTS_DATABASE = "./data/posts.csv"

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
	console.log(`Scraping ${NUM_PAGES} pages of posts`)

	//populate an array with page suffixes which will be appended to the tutorials index page urls 
	const indexPageSuffixes = Array(NUM_PAGES).fill().map((_, idx) => idx>=1 ? `?page=${idx+1}` : "")
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
	fetchUrls(indexPageUrls, 0, processIndexPage)
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
	let $ = cheerio.load(html)
	let linkElements = $('article.post')

	let links = {}

	linkElements.find('a').each((idx,linkElement) => {
		const urlMatch = $(linkElement).attr('href') ? 
			$(linkElement).attr('href').match(ITEM_LINK_REGEX) 
			: null

		if (urlMatch && urlMatch[0]) {
			url = urlMatch[0]
			id = url.match(ITEM_REGEX)[0]
			text = $(linkElement).text()

			links[id] = {id, url, text}
		}
	})

	post.market_links=JSON.stringify(Object.values(links))

	posts.push(post)


	//render the post as a line of CSV with papaparse
	//only output the header on the first line
	const csv = Papa.unparse([post], {
		header:isFirst,
		delimiter: Papa.RECORD_SEP,
		quoteChar: '\''
	})
	output.write(csv+'\r\n')

	isFirst=false
}


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
	}
}

function main() {
//	loadDatabase()
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