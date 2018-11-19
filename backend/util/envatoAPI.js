

exports.getItemSearchString = function getItemSearchString(site=undefined, page=1) {

	const queryString=""
		+ (site ? `site=${site}&`: "")
		+ `sort_by=sales&`
		+ `page_size=100&page=${page}`

	const url = `https://api.envato.com/v1/discovery/search/search/item?${queryString}`

	return url
}
