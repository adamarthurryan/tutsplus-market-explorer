
import React, { Component } from 'react';
import {connect} from 'react-redux'


//import {Autosizer, Table} from 'react-virtualized'
import VirtualizedTable from './VirtualizedTable'

const fields = ['name', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at_date']


const mapStateToProps = state => 
  Object.assign(
    state
  )

class ItemsTable extends Component {

    render() {
    	let items = this.props.items


    	//this is hacky - there must be a better way
    	let {category, subCategory, subSubCategory, subSubSubCategory} = this.props.match.params 

    	console.log(this.props.match.params)

    	let categoryPath = (category ? 
    		category + (subCategory?
    			"/"+subCategory + (subSubCategory?
    				"/"+subSubCategory + (subSubSubCategory?
    					"/"+subSubSubCategory
    					: "")
    				: "")
    			: "") 
    		: null)

    	console.log(categoryPath)

    	if (categoryPath)
    		items = items.filter(item => item.classification === categoryPath)

    	if (this.props.match.params.tag) 
    		items = items.filter(item => item.tags.includes(this.props.match.params.tag))
    	
		return <VirtualizedTable fields={fields} data={items}/>
    }
}

export default connect(mapStateToProps)(ItemsTable)