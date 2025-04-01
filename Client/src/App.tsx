import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Header from './components/Header.tsx'
import ForeCasts from './pages/Forecasts.tsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ModalPayment from './components/ModalPayment.tsx'
import { AppProvider, } from './contexts/AppContext.tsx'
import Profile from './pages/Profile.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import MyPurchases from './pages/MyPurchases.tsx'
import GetSessions from './utils/getSessions.tsx'

function App() {
  console.log(import.meta.env.VITE_PAYPAL_CLIENT_ID)
  
  //NO SE PUEDE USAR EL CONTEXT EN EL ARCHIVO DE ENTRADA
  return (
    <AppProvider>
      <GetSessions/>
      <PayPalScriptProvider options={{ "clientId": `${import.meta.env.VITE_PAYPAL_CLIENT_ID}` }}>
      <Router basename='/'>
      
        <ScrollToTop />
        <ModalPayment />
        <Header />
        
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/pronosticos' element={<ForeCasts/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/mis-compras' element={<MyPurchases/>} />
          </Routes>
      </Router>
      </PayPalScriptProvider>
    </AppProvider>
  )
}

export default App