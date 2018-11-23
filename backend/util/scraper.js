const fetch = require('node-fetch')

const FETCH_DELAY = 100

//fetch the pages in sequence
async function fetchUrls (urls, index, processText, headers={}) {
	console.log(index, urls[index])
	const url = urls[index]

	fetchWithRetry(url, headers)
		.then(text => processText(text))
		.then( () => (index < urls.length) ?
			delay(FETCH_DELAY).then(() => fetchUrls(urls, index+1, processText, headers))
			: Promise.resolve()
		)
		.catch(error => console.log(`Fetch error: ${error} for ${url}`))
}


async function fetchWithRetry(url, headers={}) {
	return fetch(url, {headers})
		.then(response => {
			if (response.ok)
				return response.text()
			else {
				if (response.status === 429) {

					console.log(`Fetch received ${response.status} for ${url}`)
					let retryAfter = response.headers.has("retry-after") ? 
						parseInt(response.headers.get("retry-after")) 
						: 300
					retryAfter += 1
					console.log(`Retrying after ${retryAfter} seconds`)
					return delay(retryAfter*1000).then(() => fetchWithRetry(url, headers))
				}
				else if (response.status === 504 || response.status === 502) {
					console.log(`Fetch received ${response.status}: Gateway error, retrying in 10 seconds`)
					return delay(10*1000).then(() => fetchWithRetry(url, headers))
				}
				else
					throw new Error(`Fetch received ${response.status} for ${url}`)
			}
		})	
}

//from https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
async function delay(t, v) {
   return new Promise(function(resolve) { 
       setTimeout(resolve.bind(null, v), t)
   });
}

exports.fetchUrls = fetchUrls
exports.fetchWithRetry = fetchWithRetry
exports.delay = delay