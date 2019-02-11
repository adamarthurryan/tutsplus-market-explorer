
const Papa = require("papaparse")
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const asyncPool = require('tiny-async-pool')
const fs = require('fs')
const readline = require('readline')

//options for papa parse
const papaOptions = {
	dynamicTyping: true,
	header: true
}

const {delay, fetchWithRetry, fetchUrls} = require('./util/scraper')




//the collected scraped posts
let posts = []

let isFirst = true


async function scrape() {

    const io = readline.createInterface({
        input: process.stdin,
        crlfDelay: Infinity
    });


//    for await (const postUrl of io) {
    io.on('line', (postUrl) => {
        scrapeUrl(postUrl)
    })
}

//fetch the pages
async function scrapeUrl(url) {
	//process.stdout.write(`Retrieved page ${url}\r`);

	await fetchWithRetry(url)
		.then(text => parsePost(url, text))
		.catch(error => console.log(`Fetch error: ${error} for ${url}`))
}


function parsePost(url, html) {
	let $ = cheerio.load(html)
	let title = $(".content-banner__title").text()
	let publication_date = $(".content-heading__publication-date").text()
	let author = $(".content-heading__author-name").text()
	processPost({url, title, publication_date, author})
}


function processPost(post) {
//	posts.push(post)

	//render the post as a line of CSV with papaparse
	//only output the header on the first line
	const csv = Papa.unparse([post], {
		header:isFirst,
		delimiter: ',',
		quoteChar: '\''
	})

    //output.write(csv+'\r\n')

    console.log(csv+'\r\n')
	isFirst=false
}


function main() {
//	loadDatabase()
//	createOutput()
	scrape()
}

main()

