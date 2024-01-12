import * as React from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom" 
import './style.css'

const animeFetchInit = 'ANIME_FETCH_INIT'
const animeFetchSuccess = 'ANIME_FETCH_SUCCESS'
const animeFetchFailure = 'ANIME_FETCH_FAILURE'
const ANIME_QUERY = 'https://api.jikan.moe/v4/anime/'

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

const ItemInfo = () => {
    const { itemId } = useParams();
    const [anime, dispatchAnime] = React.useReducer(animeReducer, {data:"", isLoading:false,isError:false})

    React.useEffect(() => {
        dispatchAnime({type:animeFetchInit})
        axios.get(`${ANIME_QUERY}${itemId}`).then(result => {
            console.log(result.data)
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
                            {anime.data.genres.map(genre => <p className="genre" key={genre.mal_id}>{genre.name}</p>)}
                            <p className="year">Year: {anime.data.year}</p>
                            <p className="rating">Rating: {anime.data.rating}</p>
                        </aside>
                        <p className="itemSynopsis">{anime.data.synopsis}</p>
                        <iframe className="itemVideo"  src={anime.data.trailer.embed_url}  allow="accelerometer;encrypted-media;gyroscope;picture-in-picture" allowFullScreen></iframe>
                    </section>
                </main>
            </> 
            }
        </>
     )
}

export {ItemInfo}