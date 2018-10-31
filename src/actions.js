
import dateFormat from 'dateformat'

//export const updateQuery = (string) => ({type: 'update_query_string', data:string})

export const updateQuerySite = (site) => ({type: 'update_query_site', data: site})
export const changeTab = (tab) => ({type: 'change_tab', data:tab})

export const addItems = (items) => ({type: 'add_items', data:items})
export const clearItems = () => ({type: 'clear_items'})

export const addPosts = (posts) => ({type: 'add_posts', data:posts})
export const clearPosts = () => ({type: 'clear_posts'})

export const loadingItems = (loaded, total) => ({type: 'loading_items', data:{loaded, total}})
export const doneLoadingItems = () => ({type: 'done_loading_items'})
export const errorLoadingItems = (error) => ({type: 'error_loading_items', data: error})

export const loadingPosts = (loaded, total) => ({type: 'loading_posts', data:{loaded, total}})
export const doneLoadingPosts = () => ({type: 'done_loading_posts'})
export const errorLoadingPosts = (error) => ({type: 'error_loading_posts', data: error})


export const startLoadingPosts = () => {

  return function (dispatch) {
    dispatch(clearPosts())
    dispatch(loadingPosts(0,0))

    fetch('/api/posts')
      .then(response => {
        if (!response.ok)
          throw new Error(`Server returned ${response.status}`)
        else if (response.headers.get('content-type').indexOf("application/json")===-1)
          throw new Error(`Server returned non-JSON data (${response.headers.get('content-type')})`)
        else
          return response.json()
      })
      .then(posts => {
        posts = posts.map(post => {
          const idMatch = post.url.match(/[a-z]+-\d+$/)
          const siteMatch = post.url.match(/https?:\/\/([^/]+)\//)

          return Object.assign(post, {
            id: idMatch[0],
            tuts_site: siteMatch[1],
            publication_date: dateFormat(Date.parse(post.publication_date), 'yyyy-mm-dd'),
            market_items: typeof post.market_items === "string" ? 
              post.market_items.split(",").map(str => parseInt(str)) : [post.market_items]
            }
          )
        })
        posts = posts.sort((a,b) => b.publication_date.localeCompare(a.publication_date))

        dispatch(loadingPosts(posts.length, posts.length))
        dispatch(addPosts(posts))
        dispatch(doneLoadingPosts())
      })
      .catch(error => {
        dispatch(errorLoadingPosts(error))
        console.log(error)
      })
  }

}

export const startLoadingItems = () => {


  return function (dispatch, getState) {
    const querySite = getState().query.site

    const queryString = "/api/items"+(querySite ? `?site=${querySite}`: "")

    dispatch(clearItems())
    dispatch(loadingItems(0,0))

    fetch(queryString)
      .then(response => {
        if (!response.ok)
          throw new Error(`Server returned ${response.status}`)
        else if (response.headers.get('content-type').indexOf("application/json")===-1)
          throw new Error(`Server returned non-JSON data (${response.headers.get('content-type')})`)
        else
          return response.json()
      })
      .then(items => {
        items = items.map(item => {

          return Object.assign(item, {
            price_dollars: item.price_cents/100,
            tags: item.tags ? item.tags.split(",") : []
          })
        })
        items = items.sort((a,b) => b.number_of_sales-a.number_of_sales)

        dispatch(loadingItems(items.length, items.length))
        dispatch(addItems(items))
        dispatch(doneLoadingItems())
      })
      .catch(error => {
        dispatch(errorLoadingItems(error))
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