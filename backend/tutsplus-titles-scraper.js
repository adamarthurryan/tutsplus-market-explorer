
const Papa = require("papaparse")
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const asyncPool = require('tiny-async-pool')
const fs = require('fs')

//options for papa parse
const papaOptions = {
	dynamicTyping: true,
	header: true
}

const {delay, fetchWithRetry, fetchUrls} = require('./util/scraper')


const NUM_PAGES = 4000
const BASE_URL = "https://tutsplus.com/tutorials"

const OUTPUT_FILE = "./data/posts-titles.csv"

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

async function scrape() {
	console.log(`Scraping ${NUM_PAGES} pages of posts titles`)

	//populate an array with page suffixes which will be appended to the tutorials index page urls 
	const indexPageSuffixes = Array(NUM_PAGES).fill().map((_, idx) => idx>=1 ? `?page=${idx+1}` : "")
	const indexPageUrls = indexPageSuffixes.map(suffix => BASE_URL+suffix)
	
	let i=0
	await asyncPool(20, indexPageUrls, url=>scrapeUrl(url, i++))
}

//fetch the pages
async function scrapeUrl(url, index) {
	process.stdout.write(`Retrieved page ${index}\r`);

	await fetchWithRetry(url)
		.then(text => processIndexPage(text))
		.catch(error => console.log(`Fetch error: ${error} for ${url}`))
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
		//remove newlines from teaser string
		let teaser = $(".posts__post-teaser", post).text().replace(/[\n\r]/g, " ")

		processPost({title, publication_date, author, url, primary_topic, primary_category, teaser})
	})
}


function processPost(post) {
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


function main() {
//	loadDatabase()
	createOutput()
	scrape()
}

main()

