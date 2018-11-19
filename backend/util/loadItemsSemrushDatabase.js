const Papa = require('papaparse')
const fs = require('fs')
const DATABASE = 'data/items-sem.csv'

//stream in the database
module.exports = async function loadItemsSemrushDatabase() {
	return new Promise( (resolve, reject) => {
		let semrushByQueryAndItem = {}

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

					if (!semrushEntry.query || !semrushEntry.url)
						throw new Error ("Semrush entry missing query or URL")
					if (! semrushByQueryAndItem[semrushEntry.query]) 
						semrushByQueryAndItem[semrushEntry.query] = {}

					if (! semrushByQueryAndItem[semrushEntry.query][semrushEntry.url])
						semrushByQueryAndItem[semrushEntry.query][semrushEntry.url] = []

					semrushByQueryAndItem[semrushEntry.query][semrushEntry.url].push(semrushEntry)

				}
				catch (err) {
					console.log(`Error processing semrush entry for item with query: ${semrushEntry.query} and url: ${semrushEntry.url}`)
				}

			})
			dataPapaStream.on('end', () => {
				//filter posts for unique values
				console.log(`Loaded ${Object.values(semrushByQueryAndItem).reduce((acc,cur) =>acc+Object.values(cur).reduce((acc,cur) => acc+cur.length, 0), 0)} lines of item keyword data from the database`)
				resolve(semrushByQueryAndItem)
			})
			dataFileStream.pipe(dataPapaStream)
		}
		else {
			console.log(`Database ${DATABASE} does not exist`)
			resolve(semrushByQueryAndItem)
		}
	})
}
