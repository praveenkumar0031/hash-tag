import React from 'react'
import Login from './components/user/Login'
import Signup from './components/user/Signup'
//import Room from './components/room/Room'
import Dashboard from './components/pages/Dashboard'
import CreateRoom from './components/room/CreateRoom'
import Chat from './components/pages/Chat'
import LandingPage from './components/pages/LandingPage'
import ForgotPassword from './components/user/ForgetPassword'
import {Routes,Route} from 'react-router-dom'
import Terms from './components/pages/Terms'

import Room from './components/room/Room'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='room/:roomId' element={<Chat/>}></Route>
        <Route path='/room/create' element={<CreateRoom/>}></Route>
        <Route path='/nearby/room' element={<Room/>}></Route>
        <Route path='/forget' element={<ForgotPassword/>}></Route>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/terms' element={<Terms/>}></Route>
      </Routes>
    </div>
  )
}

export default App