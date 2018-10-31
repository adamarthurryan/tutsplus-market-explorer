
import React, { Component } from 'react';
import {connect} from 'react-redux'


//import {Autosizer, Table} from 'react-virtualized'
import VirtualizedTable from './VirtualizedTable'

const fields = ['name', 'site', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at', "promotions"]


const mapStateToProps = state => 
  Object.assign(
    state
  )

class ItemsTable extends Component {

    render() {
    	let items = this.props.items


    	//this is hacky - there must be a better way
    	let {category, subCategory, subSubCategory, subSubSubCategory} = this.props.match.params 

    	
    	let categoryPath = (category ? 
    		category + (subCategory?
    			"/"+subCategory + (subSubCategory?
    				"/"+subSubCategory + (subSubSubCategory?
    					"/"+subSubSubCategory
    					: "")
    				: "")
    			: "") 
    		: null)

    	if (categoryPath) {

    		items = items.filter(item => item.classification === categoryPath)
    	}

    	if (this.props.match.params.tag) 
    		items = items.filter(item => item.tags.includes(this.props.match.params.tag))
    	
        let itemsWithPromotions = items.map(item => Object.assign({}, item, {
            promotions: this.props.itemPosts[item.id]
        }))

		return <div>
			{categoryPath ? <h3>Category: {categoryPath}</h3>: null}
			{this.props.match.params.tag ? <h3>Tag: {this.props.match.params.tag}</h3>: null}
			<VirtualizedTable fields={fields} data={itemsWithPromotions}/>
		</div>
    }
}

export default connect(mapStateToProps)(ItemsTable)