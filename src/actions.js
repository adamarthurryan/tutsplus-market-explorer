
import {searchForItems} from './util/envatoAPI' 
import dateFormat from 'dateformat'

export const updateQuery = (string) => ({type: 'update_query_string', data:string})
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
        posts = posts.map(post => Object.assign(post, {
            id: post.url.match(/cms-\d+/)[0],
            publication_date: dateFormat(Date.parse(post.publication_date), 'yyyy-mm-dd'),
            market_items: typeof post.market_items === "string" ? 
              post.market_items.split(",").map(str => parseInt(str)) : [post.market_items]
          }
        ))
        posts = posts.sort((a,b) => b.publication_date.localeCompare(a.publication_date))

        dispatch(loadingPosts(posts.length, posts.length))
        dispatch(addPosts(posts))
        dispatch(doneLoadingPosts())
      })
      .catch(error => {
        dispatch(errorLoadingPosts(error))
      })
  }

}

const MAX_QUERY_PAGES = 100

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


    const queryString = getState().query.string

    dispatch(continueQuery(queryString, MAX_QUERY_PAGES))

  }
}

export const continueQuery = (queryString, count=1, loaded=0) => {
  return function (dispatch, getState) {
   
    return searchForItems(queryString)
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
          else
            return response.json()
        },

        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          dispatch(errorLoadingItems(error))
        }
      )
      .then(json => {
        loaded += json.matches.length
        dispatch(loadingItems(loaded, json.total_hits))
        dispatch(addItems(json.matches))

        if (json.links.next_page_url && count > 0) {
          const nextQueryString = json.links.next_page_url.match(/\?(.*)/)[1]
          dispatch(continueQuery(nextQueryString, count-1, loaded))
        }
        else {
          dispatch(doneLoadingItems())
        }
        //now we are going to process the results and update the app state
      })
  }
}