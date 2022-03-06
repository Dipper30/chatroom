import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom'
import Login from '../components/Login'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
