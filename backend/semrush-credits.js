const SemrushSecret = require('./secret/semrush-secret')
const Semrush = require('./util/semrush-api-async')

var sem = new Semrush({
	apiKey: SemrushSecret.apiKey,
	debug: false //optional
});


async function main() {
	let results = await sem.countapiunits()
	console.log(results)
}

main()