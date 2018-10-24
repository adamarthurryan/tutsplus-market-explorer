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
    case 'update_query_string': 
      return Object.assign({}, state, {string:action.data})

    default:
      return state || {tab:""}
  }
}

export function items (state, action) {
  switch (action.type) {
    
    case 'add_items':
      //add some calculated fields to each item on intake
      let newItems = action.data.map(item => Object.assign({},item,{
        price_dollars: item.price_cents/100,
        updated_at_date: item.updated_at.match(/\d\d\d\d-\d\d-\d\d/)[0]
      })) 
      return state.concat(newItems)
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

      //merge these into the state
      return newState
    case 'clear_items':
      return []

    default:
      return state || {}
  }  
}

export function itemsLoader (state, action) {
  switch (action.type) {  
    case 'loading_items':
      return Object.assign({}, state, {status: STATE_LOADING, error: null, loaded: action.data.loaded, total:action.data.total})

    case 'done_loading_items':
      return Object.assign({}, state, {status: STATE_DONE, error: null})

    case 'error_loading_items':
      return Object.assign({}, state, {status: STATE_ERROR, error: action.data})

    default:
      return state || {status: {STATE_EMPTY}, error: null, loaded: 0, total: 0}

  }
}

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
    avg_price_dollars: (currentSummary.avg_price_dollars*currentSummary.num_items+(item.price_cents/100))/(currentSummary.num_items+1)
  } 
}
