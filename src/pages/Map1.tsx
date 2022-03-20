/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from "react"
import config from "../config"
import './map.scss'
import NotifyGenerator from '../service/notify'
import ChatRoom from '../components/Chat'
import { getToken, getUID, getUser, handleResult, reduxDispatch } from '../service/utils'
import { getMessage, loginByToken } from "../request/config"
import { clearCanvas, startCanvasGame } from '../canvas'
import { useNavigate } from 'react-router-dom'
import { connect, useSelector } from "react-redux"
import { setUser } from "../store/actions/user"
import MapSocket from '../service/Socket'
import { setInChat, setMessages } from "../store/actions/map"
import socket from "../config/socket"
import mapReducer from "../store/reducers/map"

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

const Map1: React.FC<Map1Props> = (props: any) => {
  const navigate = useNavigate()
  const initialSocket: any = null
  const initialRoomInfo: RoomInfo = {
    room: {
      name: '',
    },
    members: [],
  }
  // const socket = useChatSocket({ setMsg, setMessageList, setChatroom, setUsers })
  const [socketInstance, setSocket] = useState<any>(initialSocket)
  const [messages, setMessageList] = useState<any[]>([])
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(initialRoomInfo)
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  // redux
  const map = useSelector((state: any) => state.map)

  const printSocket = () => {
    console.log(socketInstance)
  }

  useEffect(() => {
    // if (map.inChat) window.addEventListener('keydown', quitRoomEvent)
    // if (!map.inChat) window.removeEventListener('keydown', quitRoomEvent)
  }, [map.inChat])

  // useEffect(() => {
  //   startCanvasGame()
  // })
  // const createChatRoom = () => {
  //   socket.emit('createChatRoom')
  //   console.log('send')
  // }

  // login
  useEffect(() => {
    const u = getUser()
    // clearCanvas()
    // MapSocket.reset()
    console.log(' no user ', !u || !u.uesrname)
    console.log(socketInstance)
    if (!u || !u.username) {
      // get user info by token
      const token = getToken()
      if (token) {
        loginByToken().then((res: any) => {
          console.log(res)
          if (handleResult(res, false)) {
            setCurrentUser(res.data.user)
            props.setUser(res.data.user)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('uid', res.data.user.id)
            // MapSocket.accessed = false
            // const socket = MapSocket.getInstance()
            setSocket(socket)
            // socket.startCanvasGame()
          } else {
            navigate('/')
          }
        }).catch((err: any) => {
          console.log(err)
          navigate('/')
        })
      } else {
        // redirect to login page
        navigate('/')
      }
    } else {
      if (!socketInstance || socketInstance.disconnected) {
        // MapSocket.accessed = false
        // const socket = MapSocket.getInstance()
        setSocket(socket)
        console.log('@@@@', socket)
        // socket.startCanvasGame()
      } else {
        socketInstance.startCanvasGame()
      }
    }
    return () => {
      setSocket(null)
      // MapSocket.accessed = false
    }
  }, [])

  // useEffect(() => {
  //   // focus canvas if chat window is closed
  //   console.log('@@@@@@@@@', map.inChat)
  //   if (!map.inChat) {
  //     const canvas: any = document.querySelector('canvas')
  //     canvas.focus()
  //     console.log('@@@@@@@@@ remove' )
  //     window.removeEventListener('keydown', quitRoomEventBind, true)
  //   } else {
  //     console.log('@@@@@@@@@ add' )
  //     window.addEventListener('keydown', quitRoomEventBind, true)
  //   }
    
  // }, [map.inChat])

  const quitRoomEvent = (e: KeyboardEvent) => {
    if (e.code == 'Escape' && map.inChat) {
      socketInstance.leaveRoom()
    }
  }
  // const quitRoomEventBind = quitRoomEvent.bind(this)

  const enterRoom = (roomId: string) => {
    console.log(roomId)
    reduxDispatch(setInChat(true))
    socketInstance.emit('joinRoom', roomId)
  }
  const leaveRoom = (roomId: string) => {
    socketInstance.leaveRoom()
    reduxDispatch(setInChat(false))
  }
  useEffect(() => {
    const listener = () => {
      // MapSocket.instance = null
      socketInstance.canvasInit = false
    }
    window.addEventListener('beforeunload', listener)
    return () => {
      // const socket = MapSocket.getInstance()
      // socket.close()
      window.removeEventListener('beforeunload', listener)
      // MapSocket.instance = null
      // socket.canvasInit = false
    }
  }, [])

  return (
    <div className='map'>
      <div id='mapcontent' className='content'>
        <div className='canvas-container'>
          <canvas className="map1-canvas" tabIndex={0}></canvas>
          {/* <div className='operations'>
            <button onClick={() => enterRoom('room1')}> Join Room 1</button>
            <button onClick={() => enterRoom('room2')}> Join Room 2</button>
            <button onClick={createChatRoom}>create new chat room</button>
          </div> */}
        </div>
        {/* <div className='footer'>
          没有什么信息...
        </div> */}
      </div>
      <div className={map.inChat ? 'sider expand' : 'sider'}>
        {
          // <ChatRoom leaveRoom={leaveRoom} messages={map.messages} roomInfo={map.roomInfo} socket={socketInstance} users={map.members}></ChatRoom>
        }
      </div>
    </div>
  )
}

// const mapStateToProps = (state: any, ownProps = {}) => {
//   console.log(state) // state
//   console.log(ownProps) // {}
// }

export default connect(
  (state: any) => ({
    user: state.user,
  }),
  {
    setUser,
    setMessages,
    setInChat,
  },
)(Map1)