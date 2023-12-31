import * as React from 'react'
import axios from 'axios'
import {NavigationBar} from '../navigationbar'
import {List} from '../list'
import './style.css'

const animesFetchInit = 'ANIMES_FETCH_INIT'
const animesFetchSuccess = 'ANIMES_FETCH_SUCCESS'
const animesFetchFailure = 'ANIMES_FETCH_FAILURE'
const API_ENDPOINT = 'https://api.jikan.moe/v4/anime?q='

const animesReducer = (state,action) => {
  switch(action.type){
    case animesFetchInit:
      return {...state,isLoading:true,isError:false,};
    case animesFetchSuccess:
      console.log(action.payload)
      return{...state,isLoading:false,isError:false,data:action.payload,}
    case animesFetchFailure:
      return{...state,isLoading:false,isError:true,}
    default:
      throw new Error()
  }
}

let scheduled = '';

const App = () => {
  const[searchTerm, setSearchTerm] = React.useState('')
  const [animes,dispatchAnimes] = React.useReducer(animesReducer,{data:[],isLoading:false,isError:false})
  const handleFetchAnimes = React.useCallback(() => {
    dispatchAnimes({type:animesFetchInit})
    if(!scheduled){
      setTimeout(() => {
      axios.get(`${API_ENDPOINT}${scheduled}&sfw`)
      .then(result => {
        dispatchAnimes({type:animesFetchSuccess,payload:result.data.data})
      })
      .catch(() => dispatchAnimes({type:animesFetchFailure})
    )
    scheduled = ''},1000)}
    scheduled = searchTerm;
  },[searchTerm])

  React.useEffect(() => {
    handleFetchAnimes()
  },[handleFetchAnimes])


  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }
  
  return(
    <div>
      <header className="headline-primary">
        <h1>Aplay!</h1>
        <NavigationBar onInputChange={handleSearch} search={searchTerm} />
      </header>
      {animes.isError && <p>Something went wrong...</p>}
      {animes.isLoading?(
        <p className="loadingParagraph">Loading...</p>
      ):(<List list={animes.data} />)}
    </div>
  )
}

export default App
