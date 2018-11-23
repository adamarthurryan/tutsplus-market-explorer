
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'
import {itemParams} from './fieldParams'
import * as Actions from '../actions'

const fields = ['category', 'number_of_sales', 'avg_price_dollars',  'num_items']


const mapStateToProps = state => 
  Object.assign(
    state
  )

const mapDispatchToProps = dispatch => ({
  updateCategoryNameFilter: title => dispatch(Actions.updateCategoryNameFilter(title)),
})


class CategoriesTable extends Component {


    handleFilterChange(event) {
      this.props.updateCategoryNameFilter(event.target.value)
    }

    render() {
      let categories = Object.values(this.props.categories)
  

      if (this.props.view.categoryNameFilter) {
        categories=categories.filter(
          category => category.category.toLowerCase().indexOf(this.props.view.categoryNameFilter.toLowerCase())>=0
        )
      }

		return <div>
	        <div className="ui form ">
	          <div className="fields">
		        <div className="inline field">
		          <label>Filter</label>
	    	      <input value={this.props.view.categoryNameFilter} onChange={this.handleFilterChange.bind(this)}/>
	        	</div>
	          </div>
        	</div>

			<VirtualizedTable fields={fields} fieldParams={itemParams} data={categories}/>
		</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable)