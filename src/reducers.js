export function posts (state, action) {
  switch (action.type) {
    case 'add_posts':
      return state.concat(action.data)
    case 'clear_posts':
      return []
    default: 
      return state || []
  }
}

//a map of item ids to posts to make lookup faster
export function itemPosts (state, action) {
  switch (action.type) {
    case 'add_posts':
      let newState = Object.assign({}, state)
      action.data.forEach(post => post.market_links.forEach(link => {
        if (newState[link.id]) 
          newState[link.id].push(post) 
        else
          newState[link.id] = [post]
      }))
      return newState
    case 'clear_posts':
      return {}
    default: 
      return state || {}
  }
}

const keywordsAddHelper = (field) => (state,sems) => {
  let newState = Object.assign({}, state)

  Object.values(sems).forEach(sem => sem.forEach(semLine =>{
    if (!newState[semLine.keyword])
      newState[semLine.keyword]={keyword: semLine.keyword, itemSems:[], postSems:[]}

    newState[semLine.keyword][field].push(semLine)
  }))
  return newState
}

const keywordsClearHelper = (field) => (state) => {
  let newState = Object.assign({}, state)
  Object.values(newState).map(entry => Object.assign({}, entry, {[field]:[]} ))
  return newState
}

//a map of keywords to item and post ids to make lookup faster
export function keywords (state, action) {
  switch (action.type) {
    case 'add_item_sems':
      return keywordsAddHelper('itemSems')(state, action.data)
    case 'add_post_sems':
      return keywordsAddHelper('postSems')(state, action.data)
    case 'clear_item_sems':
      return keywordsClearHelper('itemSems')(state)
    case 'clear_post_sems':
      return keywordsClearHelper('postSems')(state)
    default: 
      return state || {}
  }
}

export function view (state, action) {
  switch (action.type) {

    case 'change_tab':
      return Object.assign({}, state, {tab:action.data})
    case 'change_post_site_filter':
      return Object.assign({}, state, {postSiteFilter:action.data})
    case 'change_post_title_filter':
      return Object.assign({}, state, {postTitleFilter:action.data})
    case 'change_post_market_links_filter':
      return Object.assign({}, state, {postMarketLinksFilter:action.data})
    case 'change_category_name_filter':
      return Object.assign({}, state, {categoryNameFilter:action.data})
    case 'change_tag_name_filter':
      return Object.assign({}, state, {tagNameFilter:action.data})
    case 'change_item_name_filter':
      return Object.assign({}, state, {itemNameFilter:action.data})
    case 'change_keyword_filter':
      return Object.assign({}, state, {keywordFilter:action.data})
    case 'change_keyword_type_filter':
      return Object.assign({}, state, {keywordTypeFilter:action.data})
    case 'select_item':
      return Object.assign({}, state, {selections: Object.assign({}, state.selections, {[action.data]:true})})
    case 'unselect_item':
      const {[action.data]: oldValue, ...remaining} = state.selections 
      return Object.assign({}, state, {selections: remaining})
    default: 
      return state || {tab:"", postSiteFilter:"", postMarketLinksFilter:"", postTitleFilter:"", categoryNameFilter:"", tagNameFilter:"", itemNameFilter:"", keywordFilter:"", keywordTypeFilter:"", selections:{}}
  }
}

export function query(state, action) {
  switch (action.type) {
    case 'change_query_site': 
      return Object.assign({}, state, {site:action.data})

    default:
      return state || {site: ''}
  }
}

export function itemSems (state, action) {
  switch (action.type) {
    case 'add_item_sems':
      return Object.assign({}, state, action.data)
    case 'clear_item_sems':
      return {}
    default:
      return state || {}
  }
}

export function postSems (state, action) {
  switch (action.type) {
    case 'add_post_sems':
      return Object.assign({}, state, action.data)
    case 'clear_post_sems':
      return {}
    default:
      return state || {}
  }
}

export function items (state, action) {
  switch (action.type) {
    
    case 'add_items':
      return state.concat(action.data)
    case 'clear_items':
      return []

    default:
      return state || []
  }
}

//aggregates info on categories
export function categories (state, action) {
  switch (action.type) {
    
    case 'add_items': 
      //create new category entries from the new items
      let newState = Object.assign({}, state)
      action.data.forEach(item => newState[item.classification]=updateSummary(item.classification, newState[item.classification], item, "category"))

      //sort the categories
      newState = sortByKey(newState, 'number_of_sales')

      //merge these into the state
      return newState
    case 'clear_items':
      return []

    default:
      return state || {}
  }  
}


//aggregates info on tags
export function tags (state, action) {
  switch (action.type) {
    
    case 'add_items': 
      //create new category entries from the new items
      let newState = Object.assign({}, state)
      action.data.forEach(item => item.tags.forEach(tag=>newState[tag]=updateSummary(tag, newState[tag], item, "tag")))

      //sort the tags
      newState = sortByKey(newState, 'number_of_sales')

      //merge these into the state
      return newState
    case 'clear_items':
      return []

    default:
      return state || {}
  }  
}

const loader = (key) => (state, action) => {
  switch (action.type) {  
    case `loading_${key}`:
      return Object.assign({}, state, {status: STATE_LOADING, error: null, loaded: action.data.loaded, total:action.data.total})

    case `done_loading_${key}`:
      return Object.assign({}, state, {status: STATE_DONE, error: null})

    case `error_loading_${key}`:
      return Object.assign({}, state, {status: STATE_ERROR, error: action.data})

    default:
      return state || {status: STATE_EMPTY, error: null, loaded: 0, total: 0}

  }
}

export const itemsLoader = loader('items') 
export const postsLoader = loader('posts')
export const postSemsLoader = loader('post_sems')
export const itemSemsLoader = loader('item_sems')

export const STATE_EMPTY = "empty"
export const STATE_LOADING = "loading"
export const STATE_DONE = "done"
export const STATE_ERROR = "error"

function updateSummary(id, currentSummary, item, idFieldName) {
  if (currentSummary == null)
    return {id: id, [idFieldName]: id, num_items: 1, number_of_sales: item.number_of_sales, avg_price_dollars: item.price_cents/100}


  return {
    id: id, 
    [idFieldName]: id,
    num_items: currentSummary.num_items+1,
    number_of_sales: currentSummary.number_of_sales+item.number_of_sales,

//some items have anomolously high prices, ignore these
    avg_price_dollars: (item.price_cents<1000*100 ?
        (currentSummary.avg_price_dollars*currentSummary.num_items+(item.price_cents/100))/(currentSummary.num_items+1)
        : currentSummary.avg_price_dollars)
  } 
}

function sortByKey(data, key) {
  let sortedData = {}
  
  Object.values(data).sort( (a,b) => b[key]-a[key])
  //Object.keys(data).sort( (a,b) => data[b][key] - data[a][key])
    .forEach ( item => sortedData[item.id] = item)

  return sortedData
}