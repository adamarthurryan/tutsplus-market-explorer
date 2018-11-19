
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import VirtualizedTable from './VirtualizedTable'
import {postParams, itemParams, keywordParams} from './fieldParams'

const mapStateToProps = state => 
  Object.assign(
    state
  )

class Keyword extends Component {

    render() {
      const itemKeywordFields = ['item', 'pos', 'number_of_results', 'average_vol']
      const postKeywordFields = ['post', 'pos', 'number_of_results', 'average_vol']


      let keyword = this.props.match.params.keyword

      let keywordEntries = this.props.keywords[keyword]
      
      let postSems = []
      if (keywordEntries && keywordEntries.postSems.length) {
        postSems = keywordEntries.postSems.map(sem => {
          let post = this.props.posts.find(post => post.id===sem.id)
          return Object.assign({}, sem, {post}) 
        })

      }

      let itemSems = []
      if (keywordEntries && keywordEntries.itemSems.length) {
        itemSems = keywordEntries.itemSems.map(sem => {
          let item = this.props.items.find(item => item.id==sem.id)
          return Object.assign({}, sem, {item}) 
        })

      }
      return <div> 
        <h3>Keyword: {keyword}</h3>

        {itemSems.length>0 ?
          <VirtualizedTable  fields={itemKeywordFields} fieldParams={keywordParams} data={itemSems}/>

          :null
        }
        {postSems.length>0 ?
          <VirtualizedTable  fields={postKeywordFields} fieldParams={keywordParams} data={postSems}/>
          :null
        }
      </div>

      /*
      let intItemId = parseInt(this.props.match.params.itemId)
    	let item = this.props.items.find(item => item.id===intItemId)

      if (item) {

        let posts = this.props.itemPosts[item.id]
        posts = posts ? posts : []

        let itemSems = this.props.itemSems[item.url]

        let postFields = ['title','publication_date','author']
        const keywordFields = ['keyword', 'pos', 'number_of_results', 'average_vol']

        return <div >
          <h3>{item.name} <a rel="noopener noreferrer" target="_blank" href={item.url}>&rarr;{item.site}</a></h3>
          <p><strong>Author: </strong>{item.author_username}</p>
          <p><strong>Rating: </strong>{item.rating.rating} from {item.rating.count} users</p>
          <p><strong>Trending? </strong>{item.trending ? "Yes" : "No"}</p>
          <p><strong>Category: </strong><Link to={`/categories/${item.classification}`}>{item.classification}</Link></p>
          <p><strong>Tags: </strong>{item.tags.map(tag=> <span key={tag}><Link to={`/tags/${tag}`}>{tag}</Link>, </span>)}</p>

          { posts.length > 0 ?
            <h4>Promoted in Posts:</h4>
            :null
          }          
          { posts.length > 0 ? 
            <VirtualizedTable  fields={postFields} fieldParams={postParams} data={posts}/>
            : null 
          }

          {itemSems ?
            <h4>Keywords:</h4>
            : null
          }

          {itemSems ? 
            <VirtualizedTable fields={keywordFields} fieldParams={keywordParams} data={itemSems}/>
            : null
          }

          <h4>Description:</h4>
          {item.description.split('\n').filter(para => para.trim()!=="").map( (para, idx) => <span key={idx}>{para}<br/></span>)}

        </div>

      }
      else
        return <p>Not Found</p>
*/
    }
}

export default connect(mapStateToProps)(Keyword)