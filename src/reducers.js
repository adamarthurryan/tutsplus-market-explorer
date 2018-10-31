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
      action.data.forEach(post => post.market_items.forEach(item => {
        if (newState[item]) 
          newState[item].push(post) 
        else
          newState[item] = [post]
      }))
      return newState
    case 'clear_posts':
      return {}
    default: 
      return state || {}
  }
}

export function view (state, action) {
  switch (action.type) {

    case 'change_tab':
      return Object.assign({}, state, {tab:action.data})

    default: 
      return state || {tab:""}
  }
}

export function query(state, action) {
  switch (action.type) {
    case 'update_query_site': 
      return Object.assign({}, state, {site:action.data})

    default:
      return state || {site: ''}
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