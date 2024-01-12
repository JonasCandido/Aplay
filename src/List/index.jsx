import PropTypes from 'prop-types'
import './style.css'
import { Link } from 'react-router-dom'

const List = ({list}) => {  
    return(
        <main className="listContainer">
            {list.map(item => (<Item key={item.mal_id} {...item} />)
            )}
        </main>
    )
}
  
const Item = ({images:{jpg:{large_image_url}},title,mal_id,synopsis}) => {  
    return (
        <div className="item">
            <Link to={`/${mal_id}`}>
                <img src={large_image_url} alt={title + " cover"}></img>
                <h2>{title}</h2>
                <div className="overlay">
                    <h2>{title}</h2>
                    <div className="synopsis">
                        <p>{synopsis}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

List.propTypes = {
    list: PropTypes.array.isRequired,
}
  
Item.propTypes = {
    images: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    synopsis: PropTypes.string.isRequired,
    mal_id: PropTypes.number.isRequired,
}

export {List}