
import React from 'react'
import {Link} from 'react-router-dom'

const categoryParams={label:"Category", width:250, render: cellData => <Link to={`/categories/${cellData}`}>{cellData}</Link>}

export default {
	number_of_sales: {label: "Sales", width:60}, 
	avg_price_dollars: {label: "Avg Price", render: cellData=> `$${Math.round(cellData)}`},
	num_items: {label: "Items", width: 60},
	classification: categoryParams , 
	price_dollars: {label: "Price", width: 60, render: cellData=> `$${cellData}`}, 
	trending: {label: "Trend?", width: 60, render: cellData=> cellData ? "Yes": ""}, 
	updated_at: {label: "Updated"},

	category : categoryParams, 
	tag: {label:"Tag", render: cellData => (<Link to={`/tags/${cellData}`}>{cellData}</Link>)},
	name: {label:"Item Name", width:400, render: (cellData, rowData) => <Link to={`/items/${rowData.id}`}>{cellData}</Link>}, 

	title: {label:"Title", width:400, render : (cellData, rowData) => <Link to={`/posts/${rowData.id}`}>{cellData}</Link>},
	published_at: {label:"Publication Date"},
	author: {label:"Author"},
	promotions: {label: "Promotion", render: (cellData) => cellData ?
		<Link to={`/posts/${cellData[0].id}`}>{cellData[0].publication_date}</Link>
		: ""
	},
	site: {label: " ", width: 25, render: (cellData) => {
		switch(cellData) {
			case "themeforest.net": return "tf"
			case "codecanyon.net": return "cc"
			case "graphicriver.net": return "gr"
			case "videohive.net": return "vh"
			case "photodune.net": return "ph"
			case "3docean.net": return "3d"
			case "audiojungle.net": return "aj"
			default: return cellData
		}
	}},
	tuts_site: {label: "site", width: 60, render: (cellData) => cellData.match(/^[^.]*/)[0] }

}

