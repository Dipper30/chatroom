/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from "react"
import config from "../config"
import './map.scss'
import NotifyGenerator from '../service/notify'
import ChatRoom from '../components/Chat'
import { focusElement, getToken, getUID, getUser, handleResult, reduxDispatch } from '../service/utils'
import { getMessage, loginByToken } from "../request/config"
import { clearCanvas, startCanvasGame } from '../canvas'
import { useNavigate } from 'react-router-dom'
import { connect, useSelector } from "react-redux"
import { setUser } from "../store/actions/user"
import MapSocket from '../service/Socket'
import { setInChat, setMessages } from "../store/actions/map"
import socket from "../config/socket"
import mapReducer from "../store/reducers/map"
import Game from "../game/Game"
import { NameSpace } from "../game/types"
import GameSocket from "../game/socket/GameSocket"
import { closeChatting, toggleMyVideo, toggleMyVoice } from "../game/peer/GamePeer"

interface MapProps {
  worldName: NameSpace,
  setUser: any,
  setMessages: any,
  setInChat: (data: boolean) => {type: string, data: boolean},
}
 
const Map: React.FC<MapProps> = (props: MapProps) => {

  const navigate = useNavigate()
  const map = useSelector((state: any) => state.map)
  const [micOn, setMicOn] = useState<Boolean>(true)
  const [camOn, setCamOn] = useState<Boolean>(true)

  const leaveRoom = () => {
    const gameSocket = GameSocket.getInstance()
    gameSocket.leaveRoom(map.roomInfo.room.name)
    reduxDispatch(setInChat(false))
    focusElement('canvas')
    const game = Game.getInstance()
    game.getCurrentWorld().mainPlayer.registerKeyboardEvent()
  }

  const toHome = () => {
    navigate('/entry')
  }

  const toggleVoice = () => {
    setMicOn(toggleMyVoice())
  }

  const toggleVideo = () => {
    setCamOn(toggleMyVideo())
  }

  useEffect(() => {
    const u = getUser()
    const game = Game.getInstance()
    game.resizeCanvas(700, 500)
    console.log(u)
    if (!u || !u.username) {
      const token = getToken()
      console.log('token', token)
      if (!token) {
        alert('please log in ')
        navigate('/')
      } else {
        loginByToken().then((res: any) => {
          if (handleResult(res, false)) {
            console.log('relogin', res)
            props.setUser(res.data.user)
            game.initGame(props.worldName)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('uid', res.data.user.id)
          } else {
            alert('please log in ')
            navigate('/')
          }
        }).catch (err => {
          alert(err)
          navigate('/')
        })
      }
    } else {
      game.initGame(props.worldName)
    }
    
    return () => {
      closeChatting()
      const game = Game.getInstance()
      game.endGame()
      Game.clearInstance()
    }
  }, [])

  return ( 
    <div className='map'>
      <div onClick={toHome} className='back'> Back </div>
      <div className='title'>test: { props.worldName }</div>
      <canvas tabIndex={0} id='game'></canvas>
      <button onClick={toggleVoice}>Toggle Voice</button> { micOn ? 'On' : 'Muted' }
      <button onClick={toggleVideo}>Toggle Video</button> { camOn ? 'On' : 'Closed' }
      <div className='video-container' id='video-container'>
       
      </div>
      <div className={map.inChat ? 'sider expand' : 'sider'}>
        {
          <ChatRoom leaveRoom={leaveRoom} messages={map.messages} roomInfo={map.roomInfo} users={map.members}></ChatRoom>
        }
      </div>
    </div>
  )
}

export default connect(
  (state: any) => ({
    user: state.user,
  }),
  {
    setUser,
    setMessages,
    setInChat,
  },
)(Map)