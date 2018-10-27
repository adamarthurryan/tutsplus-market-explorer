import React, { Component } from 'react';
import {connect} from 'react-redux'

import {STATE_LOADING, STATE_ERROR, STATE_DONE} from '../reducers'

//map the input props to this component's props
//also mix in the currently calculated q-value
const mapStateToProps = state => 
    state
  
class LoadingState extends Component {


    render() {
      const loadingStringRender = (loader) =>
        ((loader.status === STATE_LOADING || loader.status === STATE_DONE)? ` ${loader.loaded} / ${loader.total}` : "") 
        + ((loader.status === STATE_ERROR) ? `error ${loader.error}` : "") 


    	return (
          <div className="ui section float right">
            <p>Items: {loadingStringRender(this.props.itemsLoader)}</p>
            <p>Posts: {loadingStringRender(this.props.postsLoader)}</p>
          </div>
    	)
    }
}


export default connect(mapStateToProps)(LoadingState)