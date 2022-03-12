import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom'
import Login from '../components/Login'
import MapSelection from '../pages/MapSelection'
import Map1 from '../pages/Map1'
import Map2 from '../pages/Map2'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/entry' element={<MapSelection />} />
        <Route path='/map1' element={<Map1 />} />
        <Route path='/map2' element={<Map2 />} />
        <Route path='/chat' element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
