import React, { Props, useEffect, useRef, useState } from 'react'
import './chatroom.scss'
import useChatSocket from '../hooks/useChatSocket'
import { withUser } from '../service/utils'
import UserMessage from './UserMessage'
import generator from '../service/notify'
import usePrevious from '../hooks/usePrev'
import MapSocket from '../service/Socket'
import socket from '../config/socket'

interface ChatRoomProps {
  socket: any,
  users: any[],
  roomInfo: RoomInfo,
  leaveRoom: Function,
  messages: any[],
}

interface RoomInfo {
  room: {
    name: string,
  },
  members: any[]
}

const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
  const [msg, setMsg] = useState<string>('')
  const [chatroom, setChatroom] = useState<RoomInfo>(props.roomInfo)
  const [users, setUsers] = useState<any>([])
  const [socketInstance, setSocket] = useState<any>(props.socket)
  // const users = props.users
  useEffect(() => {
    setSocket(props.socket)
  }, [props.socket])

  // let socket: any = null
  // socket = useChatSocket({ setMsg, setMessageList, setChatroom, setUsers })
  const [input, setInput] = useState<string>('')
  const inputEl = useRef<any>(null)
  const chatBoxView = useRef<any>(null)

  const sendMsg = () => {
    if (!input) {
      generator.generateNotify('Message cannot be empty!')
      return
    }
    if (socketInstance) socketInstance.sendMessage({ input, rid: props.roomInfo.room.name })
    else console.log('no socket')
    console.log('send ', { input, rid: props.roomInfo.room.name })
    inputEl.current.value = ''
    inputEl.current.focus()
    setInput('')
  }

  const onSendClicked = (e: React.KeyboardEvent) => {
    console.log(e.code)
    if (e.code == 'Enter') {
      sendMsg()
    } else if (e.code == 'Escape') {
      leaveRoom()
    }
    
  }

  const leaveRoom = () => {
    socketInstance.leaveRoom(props.roomInfo.room.name)
  }

  useEffect(() => {
    // compare to previous message list
    // scroll to bottom by computing diff of length
    console.log(chatBoxView.current.offsetHeight)
    chatBoxView.current.scrollTop = 100000
    console.log(chatBoxView.current.scrollTop)
  }, [props.messages])

  return (
    <>
      <div className='chat-room-container'>
        <div className="chat-box-view-outer">
          <div className='header'>
            { props.roomInfo.room.name }({props.roomInfo.members.length})
          </div>
          <div className='exit' onClick={leaveRoom}>Exit( or press esc )</div>
          <div className='chat-box-view' ref={chatBoxView}>
            <div className='chat-box'>
              {
                props.messages?.length > 0 ? props.messages.map( (msg) => <UserMessage key={msg.id} msg={msg} user={msg.User}></UserMessage> ) : ''
              }
            </div>
          </div>
        </div>
        
        <div className='type-box'>
          <input id='chatinput' onKeyDown={onSendClicked} ref={inputEl} placeholder='Type somthing...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
          <button onClick={sendMsg}>Send</button>
        </div>
      </div>
    </>
  )
}

export default ChatRoom