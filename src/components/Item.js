
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import VirtualizedTable from './VirtualizedTable'

const mapStateToProps = state => 
  Object.assign(
    state
  )

class Item extends Component {

    render() {
      let intItemId = parseInt(this.props.match.params.itemId)
    	let item = this.props.items.find(item => item.id===intItemId)

      if (item) {

        let posts = this.props.itemPosts[item.id]
        posts = posts ? posts : []

        let postFields = ['title','publication_date','author']

        return <div >
          <h3>{item.name} <a rel="noopener noreferrer" target="_blank" href={item.url}>&rarr; envato market</a></h3>
          <p><strong>Author: </strong>{item.author_username}</p>
          <p><strong>Rating: </strong>{item.rating.rating} from {item.rating.count} users</p>
          <p><strong>Trending? </strong>{item.trending ? "Yes" : "No"}</p>
          <p><strong>Category: </strong><Link to={`/categories/${item.classification}`}>{item.classification}</Link></p>
          <p><strong>Tags: </strong>{item.tags.map(tag=> <span key={tag}><Link to={`/tags/${tag}`}>{tag}</Link>, </span>)}</p>
          
          { posts.length > 0 ? 
            <div>
              <h4>Promoted in Posts:</h4>
              <VirtualizedTable fields={postFields} data={posts}/>
            </div>
            : null }

          <h4>Description:</h4>
          {item.description.split('\n').filter(para => para.trim()!=="").map( (para, idx) => <span key={idx}>{para}<br/></span>)}
        </div>
      }
      else
        return <p>Not Found</p>

    }
}

export default connect(mapStateToProps)(Item)