
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {postParams} from './fieldParams'
import * as Actions from '../actions'

import VirtualizedTable from './VirtualizedTable'


const fields = ['title','tuts_site', 'publication_date','author']


const mapStateToProps = state => 
  Object.assign(
    state
  )

const mapDispatchToProps = dispatch => ({
  updatePostTitleFilter: title => dispatch(Actions.updatePostTitleFilter(title)),
  updatePostMarketLinksFilter: enable => dispatch(Actions.updatePostMarketLinksFilter(enable)),
})

class PostsTable extends Component {

    handleFilterChange(event) {
      this.props.updatePostTitleFilter(event.target.value)
    }

    handleMarketLinksFilterChange(event) {
      this.props.updatePostMarketLinksFilter(event.target.value)      
    }

    render() {
      let posts = this.props.posts
      
      if (this.props.view.postSiteFilter) {
        posts=posts.filter(
          post => post.tuts_site.startsWith(this.props.view.postSiteFilter)
        )
      }

      if (this.props.view.postTitleFilter) {
        posts=posts.filter(
          post => post.title.toLowerCase().indexOf(this.props.view.postTitleFilter.toLowerCase())>=0
        )
      }

      if (this.props.view.postMarketLinksFilter) {
        posts=posts.filter(
          post => post.market_links && post.market_links.length >0)
      }
    	
  		return <div>
        <div className="ui form ">
            <div className="fields">
              <div className="inline field">
                <label>Filter</label>
                <input value={this.props.view.postTitleFilter} onChange={this.handleFilterChange.bind(this)}/>
              </div>
              <div className="inline field">
                <input type="checkbox" value={this.props.view.postMarketLinksFilter?"":"true"} checked={this.props.view.postMarketLinksFilter} id="promo-only-filter" onChange={this.handleMarketLinksFilterChange.bind(this)}/>
                <label for="promo-only-filter">Promo Posts Only?</label>
              </div>
            </div>
          </div>
	   		<VirtualizedTable fields={fields} fieldParams={postParams} data={posts}/>
		  </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsTable)