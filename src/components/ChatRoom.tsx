import React, { Props, useEffect, useRef, useState } from 'react'
import './chatroom.scss'
import useChatSocket from '../hooks/useChatSocket'
import { withUser } from '../service/utils'
import UserMessage from './UserMessage'
import generator from '../service/notify'
import usePrevious from '../hooks/usePrev'

const ChatRoom: React.FC = () => {
  const [msg, setMsg] = useState<string>('')
  const [messageList, setMessageList] = useState<any[]>([])
  const [chatroom, setChatroom] = useState<any>({ name: 'null' })
  const [users, setUsers] = useState<any>([])

  let socket: any = null
  socket = useChatSocket({ setMsg, setMessageList, setChatroom, setUsers })
  const [input, setInput] = useState<string>('')
  const inputEl = useRef<any>(null)
  const chatBoxView = useRef<any>(null)

  const sendMsg = () => {
    if (!input) {
      generator.generateNotify('Message cannot be empty!')
      return
    }
    if (socket) socket.emit('message', withUser(input))
    else console.log('no socket')
    inputEl.current.value = ''
    setInput('')
  }

  const prevList = usePrevious({ messageList, setMessageList })
  useEffect(() => {
    // compare to previous message list
    // scroll to bottom by computing diff of length
    const diffLen = messageList.length - prevList?.messageList.length || 0
    chatBoxView.current.scrollTop += diffLen * 50
  }, [messageList])

  const onSendClicked = (e: React.KeyboardEvent) => {
    if (e.code == 'Enter') {
      sendMsg()
    }
  }

  return (
    <>
      <div className='chat-room-container'>
        <span> { chatroom?.name } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with { users?.length } chatters</span> 
        <div className="chat-box-view-outer">
          <div className='chat-box-view' ref={chatBoxView}>
            <div className='chat-box'>
              {
                messageList.map( (msg) => <UserMessage key={msg.id} msg={msg} user={msg.User}></UserMessage> )
              }
            </div>
          </div>
        </div>
        
        <div className='type-box'>
          <input onKeyDown={onSendClicked} ref={inputEl} placeholder='Type somthing...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
          <button onClick={sendMsg}>Send</button>
        </div>
      </div>
    </>
  )
}

export default ChatRoom