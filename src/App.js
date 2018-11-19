import React, { Component } from 'react';
import './App.css';


import {NavLink, Switch, Route} from 'react-router-dom'

import QueryInput from './components/QueryInput'
import TagsTable from './components/TagsTable'
import PostsTable from './components/PostsTable'
import Post from './components/Post'
import CategoriesTable from './components/CategoriesTable'
import ItemsTable from './components/ItemsTable'
import Item from './components/Item'
import LoadingState from './components/LoadingState'
import PostFilterInput from './components/PostFilterInput'
import Keyword from './components/Keyword'
import KeywordsTable from './components/KeywordsTable'



class App extends Component {

  render() {
    return (

      <div className="ui container">

        <h1 className="ui header left floated main-header">Market Explorer</h1>

        <div className="ui right floated right aligned segment">
        <div className="ui form ">
            <div className="fields">
              <QueryInput/>
              <PostFilterInput/>
            </div>
            <LoadingState/>
        </div>
        </div>
        
        <div className="ui top attached tabular menu">
          <NavLink className="item" activeClassName="active" to="/categories">Categories</NavLink>
          <NavLink className="item" activeClassName="active" to="/tags">Tags</NavLink>
          <NavLink className="item" activeClassName="active" to="/items">All Items</NavLink>
          <NavLink className="item" activeClassName="active" to="/posts">Promo Posts</NavLink>
          <NavLink className="item" activeClassName="active" to="/keywords">Keywords</NavLink>

        </div>

        <div className="ui bottom attached segment">


          <Switch>
            <Route path="/tags/:tag" component={ItemsTable}/>
            <Route path="/tags" component={TagsTable}/>
            <Route path="/posts/:postId" component={Post}/>
            <Route path="/posts" component={PostsTable}/>
            <Route path="/categories/:category/:subCategory/:subSubCategory/:subSubSubCategory" component={ItemsTable}/>
            <Route path="/categories/:category/:subCategory/:subSubCategory" component={ItemsTable}/>
            <Route path="/categories/:category/:subCategory" component={ItemsTable}/>
            <Route path="/categories/:category" component={ItemsTable}/>
            <Route path="/categories" component={CategoriesTable}/>
            <Route path="/keywords/:keyword" component={Keyword}/>
            <Route path="/keywords" component={KeywordsTable}/>
            <Route path="/items/:itemId" component={Item}/>
            <Route path="/items" component={ItemsTable}/>
            <Route path="/" component={ItemsTable}/>
          </Switch>
        </div>
      
      </div>
  )}
} 


export default App