import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../navigationbar'
import {ItensList} from '../itenslist'
import './style.css'

const animesFetchInit = 'ANIMES_FETCH_INIT'
const animesFetchSuccess = 'ANIMES_FETCH_SUCCESS'
const animesFetchFailure = 'ANIMES_FETCH_FAILURE'
const ANIMES_QUERY = 'https://api.jikan.moe/v4/anime?q='

const animesReducer = (state,action) => {
    switch(action.type){
      case animesFetchInit:
        return {...state,isLoading:true,isError:false,};
      case animesFetchSuccess:

        return{...state,isLoading:false,isError:false,data:action.payload,}
      case animesFetchFailure:
        return{...state,isLoading:false,isError:true,}
      default:
        throw new Error()
    }
  }
  
let scheduled = '';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('name') || ''
  const [animes,dispatchAnimes] = React.useReducer(animesReducer,{data:[],isLoading:false,isError:false})
  const handleFetchAnimes = React.useCallback(() => {
    dispatchAnimes({type:animesFetchInit})
    if(!scheduled){
      setTimeout(() => {
      axios.get(`${ANIMES_QUERY}${scheduled}&sfw`)
      .then(result => {
        console.log(result)
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
    const name = event.target.value
    if(name){
      setSearchParams({name: event.target.value})
    } else {
      setSearchParams({})
    }  
  }

  return(
    <div>
      <HeaderWithNav onSearch={handleSearch} searchTerm={searchTerm}/>
      {animes.isError && <p>Something went wrong...</p>}
      {animes.isLoading?(
        <p className="loadingParagraph">Loading...</p>
      ):(<ItensList list={animes.data} />)}
    </div>
  )
}

const HeaderWithNav = (props) => {
  return(
    <header className="headline-primary">
        <h1>Aplay!</h1>
        <NavigationBar {...props}/>
    </header>
  )
}

export {Home}