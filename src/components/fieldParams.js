
import React from 'react'
import {Link} from 'react-router-dom'

const categoryParams={label:"Category", width:250, render: cellData => <Link to={`/categories/${cellData}`}>{cellData}</Link>}

export default {
	number_of_sales: {label: "Sales"}, 
	avg_price_dollars: {label: "Avg Price", render: cellData=> `$${Math.round(cellData)}`},
	num_items: {label: "Items"},
	classification: categoryParams , 
	price_dollars: {label: "Price", render: cellData=> `$${cellData}`}, 
	trending: {label: "Trending?", render: cellData=> cellData ? "Yes": ""}, 
	updated_at_date: {label: "Updated At"},

	category : categoryParams, 
	tag: {label:"Tag", render: cellData => (<Link to={`/tags/${cellData}`}>{cellData}</Link>)},
	name: {label:"Item Name", width:400, render: (cellData, rowData) => <Link to={`/items/${rowData.id}`}>{cellData}</Link>}, 
}

