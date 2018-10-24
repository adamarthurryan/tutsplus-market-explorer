
import React, { Component } from 'react';
import {connect} from 'react-redux'



const mapStateToProps = state => 
  Object.assign(
    state
  )

class ItemsTable extends Component {

    render() {
    	let item = this.props.items[this.props.match.params.itemId]


		return <p><code>{JSON.stringify(item, 2)}</code></p>
    }
}

export default connect(mapStateToProps)(ItemsTable)