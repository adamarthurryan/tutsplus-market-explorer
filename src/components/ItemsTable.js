
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {itemParams, selectedParam} from './fieldParams'
import * as Actions from '../actions'


//import {Autosizer, Table} from 'react-virtualized'
import VirtualizedTable from './VirtualizedTable'

const fields = [/*'selected',*/ 'name', 'site', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at', "promotions"]


const mapStateToProps = state => 
  Object.assign(
    state
  )
const mapDispatchToProps = dispatch => ({
  updateItemNameFilter: title => dispatch(Actions.updateItemNameFilter(title)),
  selectItem: id => dispatch(Actions.selectItem(id)),
  unselectItem: id => dispatch(Actions.unselectItem(id))
})

class ItemsTable extends Component {

    //called when the filter string is changed
    //dispatch the redux action
    handleFilterChange(event) {
      this.props.updateItemNameFilter(event.target.value)
    }

    //called when any selection checkbox is clicked
    handleSelection(id, selected) {
        console.log(id, selected)
        if (selected) 
            this.props.selectItem(id)
        else
            this.props.unselectItem(id)
        console.log(this.props.view.selections)
    }

    render() {
        //create a selected param object using the handle selection callback
        let params = Object.assign({}, itemParams, selectedParam(this.handleSelection.bind(this)))

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
    	
        if (this.props.view.itemNameFilter) {
            items=items.filter(
              item => item.name.toLowerCase().indexOf(this.props.view.itemNameFilter.toLowerCase())>=0
            )
        }


        let itemsWithPromotions = items.map(item => Object.assign({}, item, {
            promotions: this.props.itemPosts[item.id]
        }))

		return <div>
            <div className="ui form ">
              <div className="fields">
                <div className="inline field">
                  <label>Filter</label>
                  <input value={this.props.view.itemNameFilter} onChange={this.handleFilterChange.bind(this)}/>
                </div>
              </div>
            </div>
			{categoryPath ? <h3>Category: {categoryPath}</h3>: null}
			{this.props.match.params.tag ? <h3>Tag: {this.props.match.params.tag}</h3>: null}
			<VirtualizedTable fields={fields} fieldParams={params} data={itemsWithPromotions}/>
		</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsTable)