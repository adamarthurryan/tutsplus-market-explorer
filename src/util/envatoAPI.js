

export function searchForItems(site, page=1) {
	let queryString="/api/items?"
		+ (site ? `site=${site}&`: "")
		+ `sort_by=sales&`
		+ `page_size=100&page=${page}`
	return fetch(queryString)
}
