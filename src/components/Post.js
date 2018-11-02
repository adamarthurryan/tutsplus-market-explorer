
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


      const fields = ['name', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at']



      if (post) {
        const itemsSearch = post.market_links
          .map(({id, url, text}) => (
            {id, url, text, item: this.props.items.find(item => item.id == id)}
          ))
        const items = itemsSearch
          .filter( ({item}) => item !== undefined).map(({item}) => item)
        const linksNotInDb = itemsSearch
          .filter(({item})=>item === undefined)
          .map(({id, url, text})=>({id, url, item_name:text}))

        return <div >
          <h3>{post.title} <a rel="noopener noreferrer" target="_blank" href={post.url}>&rarr;{post.tuts_site}</a></h3>
          <p><strong>Publication Date: </strong>{post.publication_date}</p>
          <p><strong>Author: </strong>{post.author}</p>

          <p>{post.teaser}</p>

          <VirtualizedTable fields={fields} data={items}/>
          
          {linksNotInDb.length > 0 ?
            <div> 
              <div><em>And {linksNotInDb.length} others not in this database:</em></div>
              <VirtualizedTable disableHeader fields={['item_name']} data={linksNotInDb}/>
            </div>
            : null
          }
        </div>
      }
      else
        return <p>Not Found</p>

    }
}

export default connect(mapStateToProps)(Post)