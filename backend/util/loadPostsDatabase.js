const Papa = require('papaparse')
const fs = require('fs')
const POSTS_DATABASES = ['data/posts-titles.csv', 'data/posts-market.csv']


//stream in the database
module.exports = async function loadPostsDatabase(marketOnly=true) {
	let posts = {}

	let i=0
	for (i=0; i<POSTS_DATABASES.length; i++)
		posts =  Object.assign(posts, await loadPostsSubDatabase(marketOnly, POSTS_DATABASES[i]))

	let postsArray = Object.values(posts)

	//remove any posts that don't have a url
	postsArray = postsArray.filter(post => !! post.url)

	return Object.values(postsArray)
}

async function loadPostsSubDatabase(marketOnly=true, database)
{
	return new Promise( (resolve, reject) => {
		let posts = {}
		if (fs.existsSync(database)) {
			const dataFileStream = fs.createReadStream(database)
			const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
				dynamicTyping: true,
				header: true,
				delimiter: Papa.RECORD_SEP,
				quoteChar: '\''
			})

			//if the marketOnly flag is set, 
			//only load the posts that link to market items
			dataPapaStream.on('data', (post) => {
				if (post.market_links)
					post.market_links = JSON.parse(post.market_links)
				if (! marketOnly || (post.market_links && post.market_links.length > 0) ) 
					posts[post.url]=post 

			})
			dataPapaStream.on('end', () => {
				//filter posts for unique values
				//let uniquePosts = {}
				//posts.forEach(post => uniquePosts[post.url] = post)
				//posts = Object.values(uniquePosts)
				console.log("Loaded "+Object.keys(posts).length+ " posts"+(marketOnly?" with market links":"")+" from the database")
				resolve(posts)
			})
			dataFileStream.pipe(dataPapaStream)
		}
		else {
			console.log(`Database ${database} does not exist`)
			resolve(posts)
		}
	})
}

