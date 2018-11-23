
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'
import {keywordParams} from './fieldParams'
import * as Actions from '../actions'

const fields = ['keyword', 'max_pos', 'number_of_results', 'average_vol', 'sum_traffic','num_occurrences'  ]


const mapStateToProps = state => 
  Object.assign(
    state
  )


const mapDispatchToProps = dispatch => ({
  updateKeywordFilter: keyword=> dispatch(Actions.updateKeywordFilter(keyword)),
  updateKeywordTypeFilter: keyword=> dispatch(Actions.updateKeywordTypeFilter(keyword)),
})


function firstFromItemOrPost(keyword, prop) {
	if (keyword.itemSems.length > 0)
		return keyword.itemSems[0][prop]
	else if (keyword.postSems.length >0)
		return keyword.postSems[0][prop]
	else
		return undefined
}

function allFromItemOrPost(keyword, prop) {
	let list=[]
	list=list.concat(keyword.itemSems.map(sem=>sem[prop]))
	list=list.concat(keyword.postSems.map(sem=>sem[prop]))
	return list
}

const sum = (a,b)=> a+b
const min = (a,b) => Math.min(a,b)

class KeywordsTable extends Component {

    handleFilterChange(event) {
      this.props.updateKeywordFilter(event.target.value)
    }

    handleFilterTypeChange(event) {
      this.props.updateKeywordTypeFilter(event.target.value)
    }

    render() {

    	let keywords = Object.keys(this.props.keywords)

      if (this.props.view.keywordFilter) {
          keywords=keywords.filter(
            keyword => keyword.toLowerCase().indexOf(this.props.view.keywordFilter.toLowerCase())>=0
          )
      }

      if (this.props.view.keywordTypeFilter) {
        keywords = keywords.filter( keyword => {
          switch (this.props.view.keywordTypeFilter) {
            case 'posts':
              return this.props.keywords[keyword].postSems.length > 0
            case 'items':
              return this.props.keywords[keyword].itemSems.length > 0 
            default:
              return true
          }
        })
      }


    	keywords=keywords.map(keyword => ({
    			keyword,
    			num_occurrences: (this.props.keywords[keyword].itemSems.length + this.props.keywords[keyword].postSems.length),
    			number_of_results: firstFromItemOrPost(this.props.keywords[keyword], 'number_of_results'),
    			average_vol: firstFromItemOrPost(this.props.keywords[keyword], 'average_vol'),
    			sum_traffic: allFromItemOrPost(this.props.keywords[keyword], 'traffic').reduce(sum, 0),
				max_pos: allFromItemOrPost(this.props.keywords[keyword], 'pos').reduce(min, 99999)    
    		}))
    		.sort((a, b) => b.average_vol - a.average_vol)

		
        return <div>
          <div className="ui form ">
            <div className="fields">
              <div className="inline field">
                <label>Filter</label>
                <input value={this.props.view.keywordFilter} onChange={this.handleFilterChange.bind(this)}/>
              </div>
              <div className="inline field">
                <input checked={this.props.view.keywordTypeFilter==='posts'} onChange={this.handleFilterTypeChange.bind(this)} type="radio" value="posts" id="posts-filter"/>
                <label for="posts-filter">In Posts</label> 
              </div>
              <div className="inline field">
                <input checked={this.props.view.keywordTypeFilter==='items'} onChange={this.handleFilterTypeChange.bind(this)} type="radio" value="items" id="items-filter"/>
                <label for="items-filter">In Items</label> 
              </div>
              <div className="inline field">
                <input checked={this.props.view.keywordTypeFilter===''} onChange={this.handleFilterTypeChange.bind(this)} type="radio" value="" id="all-filter"/>
                <label for="all-filter">All</label> 
              </div>
            </div>
          </div>
          <VirtualizedTable fields={fields} fieldParams={keywordParams} data={keywords}/>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordsTable)