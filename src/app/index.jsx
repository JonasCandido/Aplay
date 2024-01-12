import { Routes, Route,} from 'react-router-dom'
import {Home} from '../home'
import {ItemInfo} from '../iteminfo'

const App = () => {
  return(
    <Routes>
      <Route index element={<Home />} />
      <Route path=":itemId" element={<ItemInfo />}/>
    </Routes>
  )
}

export default App
