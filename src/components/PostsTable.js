
import React, { Component } from 'react';
import {connect} from 'react-redux'


//import {Autosizer, Table} from 'react-virtualized'
import VirtualizedTable from './VirtualizedTable'

const fields = ['title','tuts_site', 'publication_date','author']


const mapStateToProps = state => 
  Object.assign(
    state
  )

class PostsTable extends Component {

    render() {
    	let posts = this.props.posts

    	
		return <div>
			<VirtualizedTable fields={fields} data={posts}/>
		</div>
    }
}

export default connect(mapStateToProps)(PostsTable)