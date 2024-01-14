import PropTypes from 'prop-types'
import './style.css'

const NavigationBar = ({onSearch,search}) => {
    return(
      <div className="navigationContainer">
        <NavigationOptions options={["Top", "Genre", "Season"]} />
        <input onChange={onSearch} value={search} type="text" placeholder="Search for the anime..." />
      </div>
    )
  }
  
  const NavigationOptions = ({options}) => {
    return(
      <nav className='navigationOptionsContainer'>
        {options.map((option,index) => <a href="#" key={index}>{option}</a>)}
      </nav>
    )
}

NavigationBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    search: PropTypes.string,
  }
  
NavigationOptions.propTypes = {
options: PropTypes.array.isRequired,
}

export {NavigationBar}
