
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Movies from './components/Movies'
import Login from './pages/login'
import Register from './pages/register'


const App = () => {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Movies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     </Routes>
    </BrowserRouter>
  )
}

export default App