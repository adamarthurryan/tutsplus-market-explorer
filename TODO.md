## Priority 1 ##

- Scrape for Elements links
- Integrate information on Elements items
- Ability to select and export lists of items
- Cluster keywords to show connections between posts
- Filter items by recency of update


## Priority 2 ##
- Load and display metadata for posts and items:
	- last time database was updated
	- total number of items

- Incremental loading of posts (since last scrape)

- Sort tables by clicking column headers

- Currently the flatfile database needs to be loaded entirely into memory on the server. Use a more sophisticated db that could be queried and loaded as needed.

- use a computed props with memoization library for computed data such as promotions per item, etc.

## Priority 3 ##

- Reset category/tag/item filter on load and tab switch?
	- maybe move these to local state instead of redux?
	- or the filters could be in the url?

- Refactor filter code in table components
	- show related keywords on keyword detail page
	- list keyword clusters on keyword index page

