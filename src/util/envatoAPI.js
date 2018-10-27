

export function searchForItems(queryString) {
	return fetch(`/api/items?${queryString}`)
}
