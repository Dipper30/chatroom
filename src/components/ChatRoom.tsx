import React, { useEffect, useState } from 'react'
import './chatroom.scss'
import useChatSocket from '../hooks/useChatSocket'

const ChatRoom: React.FC = () => {
  const [msg, setMsg] = useState<string>('')
  let socket: any = null
  socket = useChatSocket({ setMsg })
  const [input, setInput] = useState<string>('')

  const sendMsg = () => {
    if (socket) socket.emit('message', input)
    else console.log('no socket')
    setInput('')
  }

  return (
    <>
      <div className='chat-room-container'>
        <h1>Chat Message: { msg }</h1>
        <h1> Chat Room </h1>
        <div className='type-box'>
          <input placeholder='Type somthing...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
          <button onClick={sendMsg}>Click To Send Message</button>
        </div>
      </div>
    </>
  )
}

export default ChatRoom