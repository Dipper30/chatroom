/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from "react"
import useChatSocket from "../hooks/useChatSocket"
import { Socket, io } from 'socket.io-client'
import config from "../config"
import './map.scss'
import NotifyGenerator from '../service/notify'
import ChatRoom from '../components/Chat'
import { getUID, handleResult } from '../service/utils'
import { getMessage } from "../request/config"

interface Map1Props {
  
}

interface RoomInfo {
  room: {
    name: string,
  },
  members: any[]
}

interface SocketResonpse {
  msg: string,
  data: any,
}
 
const Map1: React.FC<Map1Props> = () => {
  const initialSocket: any = null
  const initialRoomInfo: RoomInfo = {
    room: {
      name: '',
    },
    members: [],
  }
  // const socket = useChatSocket({ setMsg, setMessageList, setChatroom, setUsers })
  const [socket, setSocket] = useState<any>(initialSocket)
  const [inChat, toggleInChat] = useState<boolean>(false)
  const [messages, setMessageList] = useState<any[]>([])
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(initialRoomInfo)
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    if (!socket) {
      const newSocket: any = io(config.SERVER_URL + '/map1', { query: { uid: getUID() } })
      newSocket.on('connect', (d: any) => {
        console.log('connect! ', d)
      })
      // newSocket.on('message', (data: string) => {
      //   setMsg(data)
      // })
      newSocket.on('connect_error', (reason: string) => {
        console.log('error: ', reason)
      })
      // newSocket.on('broadcast', (data: any) => {
      //   console.log('broadcast', data)
      //   setMsg(data)
      // })
      newSocket.on('roomInfo', (res: SocketResonpse) => {
        console.log(res)
        NotifyGenerator.generateNotify(res.msg)
        setRoomInfo(res.data)
      })
      newSocket.on('members', (data: any) => {
        setMembers(data.data)
        console.log(data.data)
      })

      newSocket.on('notify', (message: string) => {
        NotifyGenerator.generateNotify(message)
      })

      newSocket.on('updateMessages', async (res: SocketResonpse) => {
        console.log('load Message!!')
        const { msg, data } = res
        console.log('get', data)
        setMessageList(data)
      })

      newSocket.on('disconnect', () => {
        // do something
      })
      // newSocket.on('loadMessage', async (data: any) => {
      //   // pull messages
      //   const res = await getMessage()
      //   if (handleResult(res, false)) {
      //     fn.setMessageList(res.data.messages)
      //   }
      // })
      // newSocket.on('roomInfo', async (data: any) => {
      //   // pull messages
      //   const [chatroom, users] = data
      //   console.log('room1 ', data)
      //   fn.setChatroom(chatroom)
      //   fn.setUsers(users)
      // })
      // newSocket.emit('createChatRoom')
      setSocket(newSocket)
      // console.log(newSocket)
    }
    return () => socket ? socket.close() : {}
  }, [socket])

  // const createChatRoom = () => {
  //   socket.emit('createChatRoom')
  //   console.log('send')
  // }

  const enterRoom = (roomId: string) => {
    console.log(roomId)
    socket.emit('joinRoom', roomId)
    toggleInChat(true)
  }

  const leaveRoom = (roomId: string) => {
    socket.emit('leaveRoom', roomId)
    console.log(roomId)
    toggleInChat(false)
  }

  return (
    <div className='map'>
      <div className='content'>
        <div className='canvas-container'>
          <div className='operations'>
            <button onClick={() => enterRoom('room1')}> Join Room 1</button>
            <button onClick={() => enterRoom('room2')}> Join Room 2</button>
            {/* <button onClick={createChatRoom}>create new chat room</button> */}
          </div>
        </div>
        <div className='footer'>
          没有什么信息...
        </div>
      </div>
      <div className={inChat ? 'sider expand' : 'sider'}>
        {
          !inChat ? '' : <ChatRoom leaveRoom={leaveRoom} messages={messages} roomInfo={roomInfo} socket={socket} users={members}></ChatRoom>
        }
      </div>
      {/* <div>{msg}</div> */}
    </div>
  )
}
 
export default Map1