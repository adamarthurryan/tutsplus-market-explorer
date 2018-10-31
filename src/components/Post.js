
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'

const mapStateToProps = state => 
  Object.assign(
    state
  )

class Post extends Component {

    render() {
      const postId = this.props.match.params.postId
    	const post = this.props.posts.find(post => post.id===postId)


      const fields = ['name', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at_date']



      if (post) {
        const items = post.market_items.map(itemId => this.props.items.find(item => item.id === itemId)).filter(item => item)

        return <div >
          <h3>{post.title} <a rel="noopener noreferrer" target="_blank" href={post.url}>&rarr;{post.tuts_site}</a></h3>
          <p><strong>Publication Date: </strong>{post.publication_date}</p>
          <p><strong>Author: </strong>{post.author}</p>

          <p>{post.teaser}</p>

          <VirtualizedTable fields={fields} data={items}/>
          
          {post.market_items.length !== items.length ? 
            <div><em>And {post.market_items.length - items.length} others...</em></div>
            : null
          }
        </div>
      }
      else
        return <p>Not Found</p>

    }
}

export default connect(mapStateToProps)(Post)