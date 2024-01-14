import * as React from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom" 
import './style.css'
import PropTypes from 'prop-types'

const animeFetchInit = 'ANIME_FETCH_INIT'
const animeFetchSuccess = 'ANIME_FETCH_SUCCESS'
const animeFetchFailure = 'ANIME_FETCH_FAILURE'
const ANIME_QUERY = 'https://api.jikan.moe/v4/anime/'

const charactersFetchInit = 'CHARACTERS_FETCH_INIT'
const charactersFetchSuccess = 'CHARACTERS_FETCH_SUCCESS'
const charactersFetchFailure = 'CHARACTERS_FETCH_SUCCESS'

const animeReducer = (state,action) => {
    switch(action.type){
        case animeFetchInit:
            return {...state,isLoading:true,isError:false,}
        case animeFetchSuccess:
            return {...state,isLoading:false,isError:false,data:action.payload,}
        case animeFetchFailure:
            return {...state, isLoading:false, isError:true,}
        default: throw new Error()
    }
}

const charactersReducer = (state,action) => {
    switch(action.type){
        case charactersFetchInit:
            return {...state,isLoading:true,isError:false,}
        case charactersFetchSuccess:
            return {...state,isLoading:false,isError:false,data:action.payload,}
        case charactersFetchFailure:
            return {...state, isLoading:false, isError:true,}
        default: throw new Error()
    }
}

const ItemInfo = () => {
    const { itemId } = useParams()
    const [anime, dispatchAnime] = React.useReducer(animeReducer, {data:"", isLoading:false,isError:false})

    React.useEffect(() => {
        dispatchAnime({type:animeFetchInit})
        axios.get(`${ANIME_QUERY}${itemId}`).then(result => {
            dispatchAnime({type:animeFetchSuccess, payload:result.data.data,})
        })
        .catch(() => dispatchAnime({type: animeFetchFailure}))
    },[itemId])

    return (
        <>
            {anime.isError && <p className="errorParagraph">Something went wrong...</p>}
            {anime.isLoading && <p className="loadingParagraph">Loading...</p>}
            {anime.data &&
            <>
                <h1 className="itemTitle">{anime.data.title}</h1>
                <main>
                    <section className="itemDisplay">
                        <img className="itemImage" src={anime.data.images.jpg.large_image_url} alt={anime.data.title + " cover"} />
                        <aside className="itemAttributes">
                            <p className="genres">Genres:</p>
                            {anime.data.genres.map((genre,index) => <p className="genre" key={index}>{genre.name}</p>)}
                            <p className="year">Year: {anime.data.year}</p>
                            <p className="rating">Rating: {anime.data.rating}</p>
                        </aside>
                        <article className="itemSynopsis">
                            <p>{anime.data.synopsis}</p>
                        </article>
                        <iframe className="itemVideo"  src={anime.data.trailer.embed_url}  allow="accelerometer;encrypted-media;gyroscope;picture-in-picture" allowFullScreen></iframe>
                        <Characters animeId={anime.data.mal_id} />
                    </section>
                </main>
            </> 
            }
        </>
     )
}

const Characters = ({animeId}) => {
    const CHARACTERS_QUERY = `https://api.jikan.moe/v4/anime/${animeId}/characters`
    const [characters, dispatchCharacters] = React.useReducer(charactersReducer, {data: [null],isLoading: false, isError: false,})
    characters

    React.useEffect(() => {
        dispatchCharacters({type:charactersFetchInit})
        axios.get(CHARACTERS_QUERY).then(result => {
            dispatchCharacters({type:charactersFetchSuccess, payload:result.data.data,})
        })
        .catch(() => dispatchCharacters({type:charactersFetchFailure}))
    },[CHARACTERS_QUERY])

    console.log(characters)
    return(
        <article className="characters">
            {characters.isError && <p className="errorParagraph">Something went wrong...</p>}
            {characters.isLoading && <p className="loadingParagraph">Loading...</p>}
            {characters.data[0] != null && characters.data.slice(0,10).map(((characterInfo,index) => <Character key={index} {...characterInfo} />))}
        </article>
    )
}


const Character = ({character:{name,images:{jpg:{image_url}}}}) => {
    return (
        <div className="character">
            <img className="itemCharacterImage" src={image_url} />
            <p className="itemCharacterName">{name}</p>
        </div>
    )
}
Character

Characters.propTypes = {
    animeId: PropTypes.number.isRequired,
}

Character.propTypes = {
    character: PropTypes.object.isRequired,
} 

export {ItemInfo}