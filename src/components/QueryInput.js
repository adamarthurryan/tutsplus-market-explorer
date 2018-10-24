import React, { Component } from 'react';
import {connect} from 'react-redux'

import * as Actions from '../actions'

//map the input props to this component's props
//also mix in the currently calculated q-value
const mapStateToProps = state => 
  Object.assign(
    state
  )

const mapDispatchToProps = dispatch => ({
  onUpdateQuery: input => dispatch(Actions.updateQuery(input)),
  onRunQuery: item => {
      //and run the query
      dispatch(Actions.startQuery())
    }
})

class QueryInput extends Component {

 	handleQueryChange(event) {
    	this.props.onUpdateQuery(event.target.value)
  	}

	handleRunQuery() {
		this.props.onRunQuery()
	}

    render() {

    	return (
    		<div className="ui transparent icon input">
              <input type="text" value={this.props.query.string} onChange={this.handleQueryChange.bind(this)} placeholder="Query string..."/>
              <button onClick={this.handleRunQuery.bind(this)}>Run Query</button>
              <p>{this.props.itemsLoader.loaded} / {this.props.itemsLoader.total}</p>
            </div>

    	)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QueryInput)