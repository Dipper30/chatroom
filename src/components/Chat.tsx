import React, { Props, useEffect, useRef, useState } from 'react'
import './chatroom.scss'
import UserMessage from './UserMessage'
import generator from '../service/notify'
import usePrevious from '../hooks/usePrev'
import GameSocket from '../game/socket/GameSocket'
import { getInChat } from '../service/utils'

interface ChatRoomProps {
  users: any[],
  roomInfo: RoomInfo,
  leaveRoom: () => void,
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
  const [gameSocket, setSocket] = useState<GameSocket>()
  // const users = props.users
  useEffect(() => {
    const socket = GameSocket.getInstance()
    setSocket(socket)
    return () => props.leaveRoom()
  }, [])

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
    const socket = GameSocket.getInstance()
    socket.sendMessage({ input, rid: props.roomInfo.room.name })
    inputEl.current.value = ''
    inputEl.current.focus()
    setInput('')
  }

  const onSendClicked = (e: React.KeyboardEvent) => {
    if (e.code == 'Enter') {
      sendMsg()
    } else if (e.code == 'Escape') {
      props.leaveRoom()
    }
    
  }

  useEffect(() => {
    // compare to previous message list
    // scroll to bottom by computing diff of length
    // console.log(chatBoxView.current.offsetHeight)
    chatBoxView.current.scrollTop = 100000
    // console.log(chatBoxView.current.scrollTop)
  }, [props.messages])

  return (
    <>
      <div className='chat-room-container'>
        <div className="chat-box-view-outer">
          <div className='header'>
            { props.roomInfo.room.name }({props.roomInfo.members.length})
          </div>
          <div className='exit' onClick={props.leaveRoom}>Exit( or press esc )</div>
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