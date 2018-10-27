
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
	updated_at_date: {label: "Updated At"},

	category : categoryParams, 
	tag: {label:"Tag", render: cellData => (<Link to={`/tags/${cellData}`}>{cellData}</Link>)},
	name: {label:"Item Name", width:400, render: (cellData, rowData) => <Link to={`/items/${rowData.id}`}>{cellData}</Link>}, 

	title: {label:"Title", width:400, render : (cellData, rowData) => <Link to={`/posts/${rowData.id}`}>{cellData}</Link>},
	publication_date: {label:"Publication Date"},
	author: {label:"Author"},
	promotions: {label: "Promotion", render: (cellData) => cellData ?
		<Link to={`/posts/${cellData[0].id}`}>{cellData[0].publication_date}</Link>
		: ""
	}

}

