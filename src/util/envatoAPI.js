

export function searchForItems(queryString) {
	return fetch(`http://localhost:3001/items?${queryString}`)
}
