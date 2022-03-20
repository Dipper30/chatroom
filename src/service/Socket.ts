export default class Map {

}
// // import { createContext, useState } from 'react'
// // import config from '../config'
// import { io } from 'socket.io-client'
// import NotifyGenerator from '../service/notify'
// import config from "../config"
// import { focusElement, getUID, getUsername, reduxDispatch } from "./utils"
// import { useDispatch } from 'react-redux'
// import { setMessages, setRoomInfo, setInChat } from '../store/actions/map'
// import { RoleStatus, UserFrameInfo } from '../canvas/types'
// import { generateNewRole, renderCanvas, startCanvasGame } from '../canvas'
// import Role from '../canvas/Role'

// export interface SocketResonpse {
//   msg: string,
//   data: any,
// }

// export default class MapSocket {
//   io: any
//   static instance: any
//   static accessed: boolean = false
//   namespace: string
//   socket: any = null
//   canvasInit: boolean = false
//   currentFrame: any = new Map()
//   roles: Role[] = []
//   roleUID: Set<number> = new Set()

//   constructor (namespace: string = '/map1') {
//     MapSocket.accessed = true
//     this.namespace = namespace
//   }

//   static resetSocket () {
//     // this.socket.emit('close', {})
//     // this.socket = null
//     // MapSocket.accessed = false
//   }

//   static getInstance () {
//     console.log(this.accessed)
//     if (!this.instance && !this.accessed) {
//       this.instance = new MapSocket()
//       this.instance.initSocket()
//     }
//     return this.instance
//   }

//   async startCanvasGame () {
//     console.log(MapSocket.getInstance().socket)
//     if (!this.canvasInit) {
//       if (this.socket.disconnected) {
//         // await this.socket.close()
//         await this.socket.connect()
//         console.log(this.socket.id)
//         startCanvasGame(MapSocket.getInstance().socket.id)
//         this.canvasInit = true
//       } else {
//         startCanvasGame(MapSocket.getInstance().socket.id)
//         this.canvasInit = true
//       }
//     }
//   }

//   initSocket () {
//     console.log('init socket')
//     this.socket = io(
//       config.SERVER_URL + this.namespace,
//       {
//         query: { uid: getUID(), username: getUsername() },
//         transports: ['websocket'],
//         upgrade: false,
//       },
//     )
//     this.socket.on('connect', (d: any) => {
//       console.log('connect! ')
//     })
//     this.socket.on('connect_error', (reason: string) => {
//       console.log('error: ', reason)
//     })
//     this.socket.on('roomInfo', (res: SocketResonpse, callback: Function) => {
//       console.log(res)
//       // setRoomInfo
//       // NotifyGenerator.generateNotify(res.msg)
//       reduxDispatch(setRoomInfo(res.data))
//       // callback(res)
//     })
//     this.socket.on('notify', (message: string) => {
//       NotifyGenerator.generateNotify(message)
//     })
//     this.socket.on('quit', () => {
//       console.log('disconnect')
//       this.socket.disconnect()
//     })
//     this.socket.on('updateMessages', async (res: SocketResonpse) => {
//       console.log('load Message!!')
//       const { msg, data } = res
//       reduxDispatch(setMessages(data))
//     })
//     this.socket.on('leaveRoom', (res: SocketResonpse) => {
//       NotifyGenerator.generateNotify(res.msg)
//       reduxDispatch(setInChat(false))
//       reduxDispatch(setRoomInfo({
//         room: { name: '' },
//         members: [],
//         messages: [],
//       }))
//       focusElement('canvas')
//     })
//     this.socket.on('enterRoom', (res: SocketResonpse) => {
//       NotifyGenerator.generateNotify(res.msg)
//       reduxDispatch(setInChat(true))
//       focusElement('chatinput')
//     })
//     this.socket.on('frameInfo', (res: SocketResonpse) => {
//       // console.log(new Map(res?.data))
//       this.currentFrame = new Map(res?.data)
//       // check if there is new role added here
//       for (let key of this.currentFrame.keys()) {
//         const frame = this.currentFrame.get(key)
//         if (!this.roleUID.has(key)) {
//           // new role
//           this.roleUID.add(key)
//           const role = generateNewRole(frame.uid, frame.username, frame.socketId)
//           console.log('new', frame.username)
//           role.status = frame.status
//           role.offsetX = role.status.offsetX
//           role.offsetY = role.status.offsetY
//           this.roles.push(role)
//           // console.log('new')
//           // if (key != this.getSocketId()) role.renderSelfByFrame(key, r)
//         }
//       }
//       for (let role of this.roles) {
//         const frame = this.currentFrame.get(role.userId)
//         if (frame) role.status = frame.status
//       }
//     })
//     this.socket.on('toLeave', (res: SocketResonpse) => {
//       let str = 'User has left: '
//       for (let i of res.data) {
//         str += i + ' '
//       }
//       NotifyGenerator.addMessage(str)
//       this.roles.filter(role => !res.data.includes(role.userId))
//     })
//   }

//   renderAll (mySocketId: string) {
//     for (let role of this.roles) {
//       if (role.socketId != mySocketId) {
//         // console.log(role.socketId, mySocketId)
//         role.renderSelfByFrame(role)
//       }
//     }
//   }

//   getAllFrames () {
//     return this.roles
//   }

//   getLast (arr: any[]) {
//     return !arr || arr.length == 0 ? null : arr[arr.length-1]
//   }

//   sendMessage (data: { input: string, rid: string }) {
//     this.socket.emit('sendText', data)
//   }

//   close () {
//     console.log('close', this.socket)
//     this.socket.emit('close', {})
//     this.socket = null
//     MapSocket.accessed = false
//   }

//   joinRoom (roomId: string = 'room1') {
//     console.log('join ', roomId)
//     this.socket.emit('joinRoom', roomId)
//   }

//   leaveRoom (roomId: string) {
//     this.socket.emit('leaveRoom', roomId)
//   }

//   submitRoleStatus (status: RoleStatus) {
//     this.socket.emit('frameStatus', status)
//   }

// }