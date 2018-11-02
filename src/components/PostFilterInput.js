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
  updatePostFilter: site => dispatch(Actions.updatePostFilter(site)),
})

class PostFilterInput extends Component {

 	handleQueryChange(event) {
    	this.props.updatePostFilter(event.target.value)
  }

  render() {


    	return (
    		  <div className="field">
            <label>Tuts+ Site</label>
            <div className="field">
              <select className="ui fluid search dropdown" value={this.props.view.postFilter} onChange={this.handleQueryChange.bind(this)}>
                <option value="">All</option>
                <option value="code">Code</option>
                <option value="photography">Photo & Video</option>
                <option value="webdesign">Web Design</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="cgi">CGI</option>
                <option value="music">Music</option>
              </select>
            </div>
          </div>

    	)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostFilterInput)