import React, { Props, useEffect, useRef, useState } from 'react'
import './chatroom.scss'
import useChatSocket from '../hooks/useChatSocket'
import { withUser } from '../service/utils'
import UserMessage from './UserMessage'
import generator from '../service/notify'
import usePrevious from '../hooks/usePrev'

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


  const socket = props.socket
  // const users = props.users

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
    console.log('send ', { input, rid: props.roomInfo.room.name })
    if (socket) socket.emit('sendText', { input, rid: props.roomInfo.room.name })
    else console.log('no socket')
    inputEl.current.value = ''
    inputEl.current.focus()
    setInput('')
  }

  const onSendClicked = (e: React.KeyboardEvent) => {
    console.log(e.code)
    if (e.code == 'Enter') {
      sendMsg()
    }
  }

  const leaveRoom = () => {
    props.leaveRoom(props.roomInfo.room.name)
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
          <div className='exit' onClick={leaveRoom}>Exit</div>
          <div className='chat-box-view' ref={chatBoxView}>
            <div className='chat-box'>
              {
                props.messages.map( (msg) => <UserMessage key={msg.id} msg={msg} user={msg.User}></UserMessage> )
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