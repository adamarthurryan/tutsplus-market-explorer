
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'
import {itemParams} from './fieldParams'
import * as Actions from '../actions'

const fields = ['tag', 'number_of_sales', 'avg_price_dollars',  'num_items']


const mapStateToProps = state => 
  Object.assign(
    state
  )

const mapDispatchToProps = dispatch => ({
  updateTagNameFilter: title => dispatch(Actions.updateTagNameFilter(title)),
})

class TagsTable extends Component {
    handleFilterChange(event) {
      this.props.updateTagNameFilter(event.target.value)
    }

    render() {
	    let tags = Object.values(this.props.tags)
	  

	    if (this.props.view.tagNameFilter) {
	        tags=tags.filter(
	          tag => tag.tag.toLowerCase().indexOf(this.props.view.tagNameFilter.toLowerCase())>=0
	        )
	    }

		return <div>
	        <div className="ui form ">
	          <div className="fields">
		        <div className="inline field">
		          <label>Filter</label>
	    	      <input value={this.props.view.tagNameFilter} onChange={this.handleFilterChange.bind(this)}/>
	        	</div>
	          </div>
        	</div>
 
			<VirtualizedTable fields={fields} fieldParams={itemParams} data={Object.values(tags)}/>
		</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsTable)