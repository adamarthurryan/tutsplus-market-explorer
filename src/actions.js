
import dateFormat from 'dateformat'

//export const updateQuery = (string) => ({type: 'update_query_string', data:string})
export const updatePostSiteFilter = (filter) => ({type: 'change_post_site_filter', data: filter})
export const updatePostTitleFilter = (filter) => ({type: 'change_post_title_filter', data: filter})
export const updatePostMarketLinksFilter = (filter) => ({type: 'change_post_market_links_filter', data: filter})
export const updateCategoryNameFilter = (filter) => ({type: 'change_category_name_filter', data: filter})
export const updateTagNameFilter = (filter) => ({type: 'change_tag_name_filter', data: filter})
export const updateItemNameFilter = (filter) => ({type: 'change_item_name_filter', data: filter})
export const updateKeywordFilter = (filter) => ({type: 'change_keyword_filter', data: filter})
export const updateKeywordTypeFilter = (filter) => ({type: 'change_keyword_type_filter', data: filter})
export const updateQuerySite = (site) => ({type: 'change_query_site', data: site})
export const changeTab = (tab) => ({type: 'change_tab', data:tab})

export const addItems = (items) => ({type: 'add_items', data:items})
export const clearItems = () => ({type: 'clear_items'})

export const selectItem = (id) => ({type: 'select_item', data:id})
export const unselectItem = (id) => ({type: 'unselect_item', data:id})

export const addPosts = (posts) => ({type: 'add_posts', data:posts})
export const clearPosts = () => ({type: 'clear_posts'})

export const loadingItems = (loaded, total) => ({type: 'loading_items', data:{loaded, total}})
export const doneLoadingItems = () => ({type: 'done_loading_items'})
export const errorLoadingItems = (error) => ({type: 'error_loading_items', data: error})

export const loadingPosts = (loaded, total) => ({type: 'loading_posts', data:{loaded, total}})
export const doneLoadingPosts = () => ({type: 'done_loading_posts'})
export const errorLoadingPosts = (error) => ({type: 'error_loading_posts', data: error})

export const addPostSems = (sems) => ({type: 'add_post_sems', data: sems})
export const clearPostSems = (sems) => ({type: 'clear_post_sems'})

export const loadingPostSems = (loaded, total) => ({type: 'loading_post_sems', data:{loaded, total}})
export const doneLoadingPostSems = () => ({type: 'done_loading_post_sems'})
export const errorLoadingPostSems = (error) => ({type: 'error_loading_post_sems', data: error})

export const addItemSems = (sems) => ({type: 'add_item_sems', data: sems})
export const clearItemSems = (sems) => ({type: 'clear_item_sems'})

export const loadingItemSems = (loaded, total) => ({type: 'loading_item_sems', data:{loaded, total}})
export const doneLoadingItemSems = () => ({type: 'done_loading_item_sems'})
export const errorLoadingItemSems = (error) => ({type: 'error_loading_item_sems', data: error})

const REGEX_POST_ID = /[a-z]+-\d+$/
const REGEX_ITEM_ID = /\d+$/

export const startLoadingPosts = () => {
  const getQueryString = (getState) => "/api/posts"
  const countLoaded = (posts) => posts.length
  const transformLoaded = (posts) => {

    //make sure every post has a url
    posts = posts.filter(post => !! post.url)

    posts = posts.map(post => {
      if (!post.market_links) 
        post.market_links = []

      const idMatch = post.url.match(REGEX_POST_ID)
      const siteMatch = post.url.match(/https?:\/\/([^/]+)\//)

      if (idMatch && siteMatch) {
        return Object.assign(post, {
          id: idMatch[0],
          tuts_site: siteMatch[1],
          publication_date: dateFormat(Date.parse(post.publication_date), 'yyyy-mm-dd'),
        })
      }
      else throw new Error(`Invalid post format: ${JSON.stringify(post)}`)
    })
    posts = posts.sort((a,b) => b.publication_date.localeCompare(a.publication_date))

    return posts    
  }

  return startLoading(getQueryString, countLoaded, transformLoaded, {add:addPosts, clear:clearPosts, loading:loadingPosts, errorLoading:errorLoadingPosts, doneLoading:doneLoadingPosts})
}



export const startLoadingItems = () => {
  const getQueryString = (getState) => {
    const querySite = getState().query.site
    return "/api/items"+(querySite ? `?site=${querySite}`: "")
  }
  const countLoaded = (items) => items.length
  const transformLoaded = (items) => {
    items = items.map(item => {

      return Object.assign(item, {
        price_dollars: item.price_cents/100,
        tags: item.tags ? item.tags.split(",") : [],
      })
    })
    items = items.sort((a,b) => b.number_of_sales-a.number_of_sales)

    return items    
  }

  return startLoading(getQueryString, countLoaded, transformLoaded, {add:addItems, clear:clearItems, loading:loadingItems, errorLoading:errorLoadingItems, doneLoading:doneLoadingItems})
}


export const startLoadingItemSems = () => {
  let getQueryString = (getState) => {
    const querySite = getState().query.site
    return "/api/sem/items"+(querySite ? `?site=${querySite}`: "")
  }
  let countLoaded = (sems) => Object.values(sems).reduce((acc,cur) => acc+cur.length, 0)
  let transformloaded = (sems) => {
    Object.values(sems).forEach(sem => sem.forEach(line => {
      if (!line.url) {
        console.log(`Malformed sem line:`, sem, line)
        throw new Error("Malformed sem record")
      }
      line.id=parseInt(line.url.match(REGEX_ITEM_ID)[0])
    }))
    return sems
  }


  return startLoading(getQueryString, countLoaded, transformloaded, {add:addItemSems, errorLoading:errorLoadingItemSems, loading:loadingItemSems, doneLoading: doneLoadingItemSems, clear: clearItemSems})
} 
export const startLoadingPostSems = () => {
  let getQueryString = (getState) => "/api/sem/posts"
  let countLoaded = (sems) => Object.values(sems).reduce((acc,cur) => acc+cur.length, 0)
  let transformloaded = (sems) => {
    Object.values(sems).forEach(sem => sem.forEach(line => {
      if (!line.url) {
        console.log(`Malformed sem line:`, sem, line)
        throw new Error("Malformed sem record")
      }
      line.id = line.url.match(REGEX_POST_ID)[0]
    }))
    return sems
  }
  return startLoading(getQueryString, countLoaded, transformloaded, {add:addPostSems, errorLoading:errorLoadingPostSems, loading:loadingPostSems, doneLoading: doneLoadingPostSems, clear: clearPostSems})
}


const startLoading = (getQueryString, countLoaded, transformLoaded=undefined, {add, errorLoading, loading, doneLoading, clear}) => {

  return function (dispatch, getState) {
 
    dispatch(clear())
    dispatch(loading(0,0))

    const queryString = getQueryString(getState)

    fetch(queryString)
      .then(response => {
        if (!response.ok)
          throw new Error(`Server returned ${response.status}`)
        else if (response.headers.get('content-type').indexOf("application/json")===-1)
          throw new Error(`Server returned non-JSON data (${response.headers.get('content-type')})`)
        else
          return response.json()
      })
      .then(loadedData => {

        let count = countLoaded(loadedData)
        if (transformLoaded)
          loadedData = transformLoaded(loadedData)

        dispatch(loading(count, count))
        dispatch(add(loadedData))
        dispatch(doneLoading())
      })
      .catch(error => {
        dispatch(errorLoading(error))
        console.log(error)
      })

  }
}

/*
export const startQuery = () => {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch and getState methods as arguments to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch, getState) {
    
  
    // update state to inform that network request is starting 
    dispatch(clearItems())
    dispatch(loadingItems(0,0))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.


    dispatch(continueQuery(1))

  }
}

export const continueQuery = (page=1, loaded=0) => {
  return function (dispatch, getState) {
    
    const querySite = getState().query.site


    return searchForItems(querySite, page)
      .then(response => {
        return response
      })
      .then(

        response =>  {
          //should test for status code and dispatch an error for failing codes
          if (!response.ok)
            throw new Error(`Server returned ${response.status}`)
          else if (response.headers.get('content-type').indexOf("application/json")===-1)
            throw new Error(`Server returned non-JSON data (${response.headers.get('content-type')})`)
          else {
            return response.json()
          }
        },

        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          dispatch(errorLoadingItems(error))
          console.log(error)
        }
      )
      .then(json => {
        loaded += json.matches.length
        dispatch(loadingItems(loaded, json.total_hits))
        dispatch(addItems(json.matches))

        if (json.links.next_page_url && page < MAX_QUERY_PAGES) {
          dispatch(continueQuery(page+1, loaded))
        }
        else {
          dispatch(doneLoadingItems())
        }
        //now we are going to process the results and update the app state
      })
  }
}*/