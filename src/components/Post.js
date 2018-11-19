
import React, { Component } from 'react';
import {connect} from 'react-redux'

import VirtualizedTable from './VirtualizedTable'
import {itemParams, keywordParams} from './fieldParams'

const mapStateToProps = state => 
  Object.assign(
    state
  )

class Post extends Component {

    render() {
      const postId = this.props.match.params.postId
    	const post = this.props.posts.find(post => post.id===postId)
       
      const fields = ['name', 'classification', 'price_dollars', 'number_of_sales', 'trending', 'updated_at']
      const keywordFields = ['keyword', 'pos', 'number_of_results', 'average_vol']

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

        const postSems = this.props.postSems[post.url]


        return <div >
          <h3>{post.title} <a rel="noopener noreferrer" target="_blank" href={post.url}>&rarr;{post.tuts_site}</a></h3>
          <p><strong>Publication Date: </strong>{post.publication_date}</p>
          <p><strong>Author: </strong>{post.author}</p>

          <p>{post.teaser}</p>

          {linksNotInDb.length + items.length > 0 ?
            <h4>Promoted Items:</h4>
            : null
          }
          {linksNotInDb.length + items.length > 0 ?
            <VirtualizedTable fields={fields} fieldParams={itemParams} data={items}/>
            : null
          }            
          {linksNotInDb.length > 0 ?
            <div><em>And {linksNotInDb.length} others not in this database:</em></div>
              : null
          }
          {linksNotInDb.length > 0 ?
            <VirtualizedTable disableHeader fields={['item_name']} fieldParams={itemParams} data={linksNotInDb}/>
            : null
          }

          {postSems ?
            <h4>Keywords:</h4>
            : null
          }
          {postSems ? 
            <VirtualizedTable fields={keywordFields} fieldParams={keywordParams} data={postSems}/>
            : null
          }

        </div>
      }
      else
        return <p>Not Found</p>

    }
}

export default connect(mapStateToProps)(Post)