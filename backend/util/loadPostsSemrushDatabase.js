const Papa = require('papaparse')
const fs = require('fs')
const DATABASE = 'data/posts-sem.csv'

//stream in the database
module.exports = async function loadPostsSemrushDatabase() {
	return new Promise( (resolve, reject) => {
		let semrushByPost = {}

		if (fs.existsSync(DATABASE)) {
			const dataFileStream = fs.createReadStream(DATABASE)
			const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
				dynamicTyping: true,
				header: true,
				delimiter: Papa.RECORD_SEP,
				quoteChar: '\'',
				skipEmptyLines: 'greedy'
			})

			//only load the posts that link to market items
			dataPapaStream.on('data', (semrushEntry) => {
				try {

					if (!semrushEntry.url)
						throw new Error ("Semrush entry missing URL")

					if (semrushByPost[semrushEntry.url]) 
						semrushByPost[semrushEntry.url].push(semrushEntry)
					else
						semrushByPost[semrushEntry.url] = [semrushEntry]
				}
				catch (err) {
					console.log(`Error processing semrush entry for post with url: ${semrushEntry.url}`)
				}

			})
			dataPapaStream.on('end', () => {
				//filter posts for unique values
				console.log(`Loaded ${Object.values(semrushByPost).reduce((acc,cur) =>acc+cur.length, 0)} lines of post keyword data from the database`)
				resolve(semrushByPost)
			})
			dataFileStream.pipe(dataPapaStream)
		}
		else {
			console.log(`Database ${DATABASE} does not exist`)
			resolve(semrushByPost)
		}
	})
}
