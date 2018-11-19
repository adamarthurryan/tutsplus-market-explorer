
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {postParams} from './fieldParams'


import VirtualizedTable from './VirtualizedTable'


const fields = ['title','tuts_site', 'publication_date','author']


const mapStateToProps = state => 
  Object.assign(
    state
  )

class PostsTable extends Component {

    render() {
      let posts = this.props.posts
      
      if (this.props.view.postFilter)
        posts=posts.filter(
          post => post.tuts_site.startsWith(this.props.view.postFilter)
        )
    	
  		return <div>
	   		<VirtualizedTable fields={fields} fieldParams={postParams} data={posts}/>
		  </div>
    }
}

export default connect(mapStateToProps)(PostsTable)