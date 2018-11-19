const Papa = require('papaparse')
const fs = require('fs')
const POSTS_DATABASE = 'data/posts.csv'


//stream in the database
module.exports = async function loadPostsDatabase() {
	return new Promise( (resolve, reject) => {
		let posts = []
		if (fs.existsSync(POSTS_DATABASE)) {
			const dataFileStream = fs.createReadStream(POSTS_DATABASE)
			const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
				dynamicTyping: true,
				header: true,
				delimiter: Papa.RECORD_SEP,
				quoteChar: '\''
			})

			//only load the posts that link to market items
			dataPapaStream.on('data', (post) => {
				post.market_links = JSON.parse(post.market_links)
				if (post.market_links.length > 0 ) posts.push(post) 
			})
			dataPapaStream.on('end', () => {
				//filter posts for unique values
				//let uniquePosts = {}
				//posts.forEach(post => uniquePosts[post.url] = post)
				//posts = Object.values(uniquePosts)
				console.log("Loaded "+posts.length+ " posts with market links from the database")
				resolve(posts)
			})
			dataFileStream.pipe(dataPapaStream)
		}
		else {
			console.log(`Database ${POSTS_DATABASE} does not exist`)
			resolve(posts)
		}
	})
}

