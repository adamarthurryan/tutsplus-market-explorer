const Papa = require('papaparse')
const fs = require('fs')
const ITEMS_DATABASE = 'data/items.csv'

//stream in the database
module.exports = async function loadItemsDatabase() {
	return new Promise( (resolve, reject) => {
		let itemsByQuery = {}

		if (fs.existsSync(ITEMS_DATABASE)) {
			const dataFileStream = fs.createReadStream(ITEMS_DATABASE)
			const dataPapaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {//options for papa parse
				dynamicTyping: true,
				header: true,
				delimiter: Papa.RECORD_SEP,
				quoteChar: '\''
			})

			//only load the posts that link to market items
			dataPapaStream.on('data', (item) => {
				try {
					item.rating = item.rating ? JSON.parse(item.rating) : null


					if (itemsByQuery[item.query]) 
						itemsByQuery[item.query].push(item)
					else
						itemsByQuery[item.query] = [item]
				}
				catch (err) {
					console.log(`Error processing item with id: ${item.id}`)
				}

			})
			dataPapaStream.on('end', () => {
				//filter posts for unique values
				console.log(`Loaded ${Object.values(itemsByQuery).reduce((acc,cur) =>acc+cur.length, 0)} items from the database`)
				resolve(itemsByQuery)
			})
			dataFileStream.pipe(dataPapaStream)
		}
		else {
			console.log(`Database ${ITEMS_DATABASE} does not exist`)
			resolve(itemsByQuery)
		}
	})
}
