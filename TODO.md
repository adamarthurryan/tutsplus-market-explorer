Load and display metadata for posts and items:

 - last time database was updated
 - total number of items

Incremental loading of posts (since last scrape)

Scrape for elements links

Sort tables by clicking column headers

Integrate keyword research / SEMRush data

Ability to select and export lists of items

Currently the flatfile database needs to be loaded entirely into memory on the server. Use a more sophisticated db that could be queried and loaded as needed.

Reset category/tag/item filter on load and tab switch?
	- maybe move these to local state instead of redux?

Refactor filter code in each table component