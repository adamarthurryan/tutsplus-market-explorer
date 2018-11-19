
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'
import {keywordParams} from './fieldParams'

const fields = ['keyword', 'num_occurrences', 'number_of_results', 'average_vol', 'sum_traffic', 'max_pos' ]


const mapStateToProps = state => 
  Object.assign(
    state
  )

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

    render() {

    	console.log( this.props.keywords[Object.keys(this.props.keywords)[0]])
    	const keywords = Object.keys(this.props.keywords)
    		.map(keyword => ({
    			keyword,
    			num_occurrences: (this.props.keywords[keyword].itemSems.length + this.props.keywords[keyword].postSems.length),
    			number_of_results: firstFromItemOrPost(this.props.keywords[keyword], 'number_of_results'),
    			average_vol: firstFromItemOrPost(this.props.keywords[keyword], 'average_vol'),
    			sum_traffic: allFromItemOrPost(this.props.keywords[keyword], 'traffic').reduce(sum, 0),
				max_pos: allFromItemOrPost(this.props.keywords[keyword], 'pos').reduce(min, 99999)    
    		}))
    		.sort((a, b) => b.average_vol - a.average_vol)

		return <VirtualizedTable fields={fields} fieldParams={keywordParams} data={keywords}/>
    }
}

export default connect(mapStateToProps)(KeywordsTable)