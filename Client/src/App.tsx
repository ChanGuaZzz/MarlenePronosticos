import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <LanguageProvider>
      <Router basename='/'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/pronosticos' element={<></>} />
          <Route path='/profile' element={<></>} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
