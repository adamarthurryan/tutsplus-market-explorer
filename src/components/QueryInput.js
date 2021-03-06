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
  updateQuerySite: site => dispatch(Actions.updateQuerySite(site)),
  startLoadingItems: () => dispatch(Actions.startLoadingItems()),
  startLoadingItemSems: () => dispatch(Actions.startLoadingItemSems()),
})

class QueryInput extends Component {

 	handleQueryChange(event) {
    	this.props.updateQuerySite(event.target.value)
      this.props.startLoadingItems()
      this.props.startLoadingItemSems()
  }

  render() {


    	return (
    		  <div className="field">
            <label>Market Site</label>
            <div className="field">
              <select className="ui fluid search dropdown" value={this.props.query.site} onChange={this.handleQueryChange.bind(this)}>
                <option value="">All</option>
                <option value="codecanyon.net">CodeCanyon</option>
                <option value="graphicriver.net">GraphicRiver</option>
                <option value="themeforest.net">ThemeForest</option>
                <option value="audiojungle.net">AudioJungle</option>
                <option value="photodune.net">PhotoDune</option>
                <option value="videohive.net">VideoHive</option>
                <option value="3docean.net">3dOcean</option>
              </select>
            </div>
          </div>

    	)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QueryInput)