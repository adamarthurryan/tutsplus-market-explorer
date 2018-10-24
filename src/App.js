import React, { Component } from 'react';
import './App.css';


import {NavLink, Switch, Route} from 'react-router-dom'

import QueryInput from './components/QueryInput'
import TagsTable from './components/TagsTable'
import CategoriesTable from './components/CategoriesTable'
import ItemsTable from './components/ItemsTable'
import Item from './components/Item'

class App extends Component {
  render() {
    return (

      <div className="ui container">

        <h1 className="ui header main-header">Market Explorer</h1>

        <div className="ui top attached tabular menu">
          <NavLink className="item" activeClassName="active" to="/categories">Categories</NavLink>
          <NavLink className="item" activeClassName="active" to="/tags">Tags</NavLink>
          <NavLink className="item" activeClassName="active" to="/items">All Items</NavLink>

          <div className="right menu">
            <div className="item">
              <QueryInput/>
            </div>
          </div>
        </div>

        <div className="ui bottom attached segment">
          <Switch>
            <Route path="/tags/:tag" component={ItemsTable}/>
            <Route path="/tags" component={TagsTable}/>
            <Route path="/categories/:category/:subCategory/:subSubCategory/:subSubSubCategory" component={ItemsTable}/>
            <Route path="/categories/:category/:subCategory" component={ItemsTable}/>
            <Route path="/categories/:category" component={ItemsTable}/>
            <Route path="/categories" component={CategoriesTable}/>
            <Route path="/items/:itemId" component={Item}/>
            <Route path="/items" component={ItemsTable}/>
          </Switch>
        </div>
      
      </div>
  )}
} 


export default App