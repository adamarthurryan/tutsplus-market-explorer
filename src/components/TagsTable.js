
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'

const fields = ['tag', 'number_of_sales', 'avg_price_dollars',  'num_items']


const mapStateToProps = state => 
  Object.assign(
    state
  )

class TagsTable extends Component {

    render() {
		return <VirtualizedTable fields={fields} data={Object.values(this.props.tags)}/>
    }
}

export default connect(mapStateToProps)(TagsTable)