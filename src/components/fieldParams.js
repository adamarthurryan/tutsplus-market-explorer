
import React from 'react'
import {Link} from 'react-router-dom'

const categoryFieldParams={label:"Category", width:250, render: cellData => <Link to={`/items/bycategory/${cellData}`}>{cellData}</Link>}

const itemParams = {
	number_of_sales: {label: "Sales", width:60}, 
	avg_price_dollars: {label: "Avg Price", render: cellData=> `$${Math.round(cellData)}`},
	num_items: {label: "Items", width: 60},
	classification: categoryFieldParams , 
	category : categoryFieldParams, 
	price_dollars: {label: "Price", width: 60, render: cellData=> `$${cellData}`}, 
	trending: {label: "Trend?", width: 60, render: cellData=> cellData ? "Yes": ""}, 
	updated_at: {label: "Updated"},

	tag: {label:"Tag", render: cellData => (<Link to={`/tags/${cellData}`}>{cellData}</Link>)},
	name: {label:"Item Name", width:400, render: (cellData, rowData) => <Link to={`/items/${rowData.id}`}>{cellData}</Link>}, 

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

}

const selectedParam = (selectionCallback) => {
	return { selected: {label: " ", width: 25, render: (cellData, rowData) => {
		let toggle = cellData
		let changeHandler = (event)=> {
			toggle = ! toggle
			selectionCallback(event.target.value, toggle)
		}

		return<input checked={cellData} onChange={changeHandler} type="checkbox" value={rowData.id}/> 
	} }
	}
}

const keywordParams = {
	keyword: {label:"Keyword", width: 400, render: cellData => (<Link to={`/keywords/${cellData}`}>{cellData}</Link>)}, 
	pos: {label:"Position", width: 60},
	max_pos: {label: "Max Pos", width: 60},
	traffic: {label:"Traffic", width: 60}, 
	sum_traffic: {label:"Sum Traffic", width: 60}, 
	number_of_results: {label:"Num Results", width: 60}, 
	average_vol: {label:"Avg Vol", width:60},
	  item: {
	    label:"Item", 
	    width:400, 
	    render: (cellData, rowData) => 
	      (cellData ? 
	        <Link to={`/items/${cellData.id}`}>{cellData.name}</Link>
	        : <Link to={`/items/${rowData.id}`}>{rowData.id}</Link>
	      )
	  },
	  post: {
	    label:"Post", 
	    width:400, 
	    render: (cellData, rowData) => 
	      (cellData ? 
	        <Link to={`/posts/${cellData.id}`}>{cellData.title}</Link>
	        : <Link to={`/posts/${rowData.id}`}>{rowData.id}</Link>
	      )
	  },
	num_occurrences: {
		label: "Count",
		width: 60,
	}          

}

const postParams = {
	title: {label:"Title", width:400, render : (cellData, rowData) => <Link to={`/posts/${rowData.id}`}>{cellData}</Link>},
	published_at: {label:"Publication Date"},
	author: {label:"Author"},
	tuts_site: {label: "site", width: 60, render: (cellData) => cellData.match(/^[^.]*/)[0] },
	category : categoryFieldParams, 
}


export {itemParams, postParams, keywordParams, selectedParam}