import { io } from 'socket.io-client'
import config from '../../config'
import { focusElement, getUID, getUsername, reduxDispatch } from '../../service/utils'
import { setInChat, setMessages, setRoomInfo } from '../../store/actions/map'
import Game from '../Game'
import NotifyGenerator from '../../service/notify'
import { FrameInfo } from '../types.d'

export interface SocketResponse {
  msg: string,
  data: any,
}

export default class GameSocket {
  io: any
  static instance: any
  static accessed: boolean = false
  #namespace: string = ''
  #socket: any = null
  #tryReconnect: boolean = true

  waitingForReset: boolean = false
  canvasInit: boolean = false
  currentFrame: Map<number, FrameInfo> = new Map()
  // roles: Role[] = []
  roleUID: Set<number> = new Set()

  constructor () {
    // MapSocket.accessed = true
  }

  /**
   * if socket is not connected, reconnect
   * @returns true if current socket is connected, false otherwise
   */
  initSocket (namespace: string): boolean {
    if (this.#tryReconnect == false) return false
    console.log('init socket ', namespace, this.#socket)
    
    this.namespace = namespace

    if (this.#socket && this.#socket.connected) {
      console.log('already connected', this.#socket)
      return true
    }

    if (this.#socket && !this.#socket.connected) {
      console.log('not connected', this.#socket)
      this.resetSocket()
      return false
    }

    console.log(config.SERVER_URL + this.namespace)
    // no socket
    
    this.#socket = io(
      config.SERVER_URL + '/' + this.namespace,
      {
        query: { uid: getUID(), username: getUsername() },
        transports: ['websocket'],
        upgrade: false,
      },
    )

    this.bindSocketEvents()

    return false
  }

  bindSocketEvents () {
    this.#socket.on('connect', this.onConnection)
    // this.#socket.on('enterRoom', (res: SocketResponse) => {
    //   NotifyGenerator.generateNotify(res.msg)
    //   reduxDispatch(setInChat(true))
    //   focusElement('chatinput')
    // })
    this.#socket.on('frameInfo', this.onGetFrameInfo)
    this.#socket.on('enterRoom', this.onEnterRoom)
    this.#socket.on('roomInfo', this.onRoomInfo)
    this.#socket.on('updateMessages', this.onUpdateMesage)
    this.#socket.on('leaveRoom', this.onLeaveRoom)
  }
  
  /**
   * close current socket, if there is one, and init socket with namespace
   * @param namespace 
   */
  resetSocket (namespace?: string) {
    this.closeSocket()
    const ns = namespace || this.#namespace
    this.initSocket(ns)
  }

  get namespace () {
    return this.#namespace
  }

  set namespace (namespace: string) {
    this.#namespace = namespace
  }

  static getInstance () {
    if (!this.instance) {
      this.instance = new GameSocket()
    }
    return this.instance
  }

  // #region 
  // emit event
  closeSocket (namespace?: string) {
    console.log('close event emitted')
    this.#socket && this.#socket.emit('close', {})
    // this.waitingForReset = true
    this.#socket = null
    // console.log('close', this.socket)
  }

  submitStatus (status: any) {
    const uid = getUID()
    this.#socket && this.#socket.emit('frameStatus', {
      ...status,
      uid,
    })
  }

  enterRoom (roomId: string) {
    this.#socket && this.#socket.emit('joinRoom', roomId)
  }

  leaveRoom (roomId: string) {
    this.#socket && this.#socket.emit('leaveRoom', roomId)
  }

  sendMessage (data: { input: string, rid: string }) {
    this.#socket && this.#socket.emit('sendText', data)
  }

  // #endregion

  // #region 
  // on event
  onCloseSocket () {
    this.#socket = null
    if (this.waitingForReset == true) {
      this.waitingForReset = false
      this.initSocket(this.#namespace)
    }
    console.log('close', this.#socket)
  }

  onConnection (res: SocketResponse) {
    console.log('connected!')
    const game = Game.getInstance()
    game.allowStart()
  }

  onNotify (res: string) {
    NotifyGenerator.generateNotify(res)
  }

  onRoomInfo (res: SocketResponse) {
    // NotifyGenerator.generateNotify(res.msg)
    console.log(res)
    // setRoomInfo
    NotifyGenerator.generateNotify(res.msg)
    reduxDispatch(setRoomInfo(res.data))
  }

  onEnterRoom (res: SocketResponse) {
    NotifyGenerator.generateNotify(res.msg)
    reduxDispatch(setInChat(true))
    focusElement('chatinput')
  }

  onLeaveRoom (res: SocketResponse) {
    reduxDispatch(setInChat(false))
  }

  onUpdateMesage (res: SocketResponse) {
    const { msg, data } = res
    reduxDispatch(setMessages(data))
  }

  // onChatMessage (res: SocketResponse) {
  //   const { msg, data } = res
  //   reduxDispatch(setMessages(data))
  // }

  onGetFrameInfo (res: SocketResponse) {
    // console.log(res)
    this.currentFrame = new Map(res?.data)
    const game = Game.getInstance()
    game.emitFrameInfo(this.currentFrame)
    // check if there is new role added here
    // console.log(this.currentFrame)
    // for (let key of this.currentFrame.keys()) {
    //   const frame = this.currentFrame.get(key)
    //   if (!this.roleUID.has(key)) {
    //     // new role
    //     this.roleUID.add(key)
    //     const role = generateNewRole(frame.uid, frame.username, frame.socketId)
    //     console.log('new', frame.username)
    //     role.status = frame.status
    //     role.offsetX = role.status.offsetX
    //     role.offsetY = role.status.offsetY
    //     this.roles.push(role)
    //     // console.log('new')
    //     // if (key != this.getSocketId()) role.renderSelfByFrame(key, r)
    //   }
    // }
    // for (let role of this.roles) {
    //   const frame = this.currentFrame.get(role.userId)
    //   if (frame) role.status = frame.status
    // }
  }

  // #endregion


  //   this.socket = io(
  //     config.SERVER_URL + this.namespace,
  //     {
  //       query: { uid: getUID(), username: getUsername() },
  //       transports: ['websocket'],
  //       upgrade: false,
  //     },
  //   )
  //   this.socket.on('connect', (d: any) => {
  //     console.log('connect! ')
  //   })
  //   this.socket.on('connect_error', (reason: string) => {
  //     console.log('error: ', reason)
  //   })
  //   this.socket.on('roomInfo', (res: SocketResonpse, callback: Function) => {
  //     console.log(res)
  //     // setRoomInfo
  //     // NotifyGenerator.generateNotify(res.msg)
  //     reduxDispatch(setRoomInfo(res.data))
  //     // callback(res)
  //   })
  //   this.socket.on('notify', (message: string) => {
  //     NotifyGenerator.generateNotify(message)
  //   })
  //   this.socket.on('quit', () => {
  //     console.log('disconnect')
  //     this.socket.disconnect()
  //   })
  //   this.socket.on('updateMessages', async (res: SocketResonpse) => {
  //     console.log('load Message!!')
  //     const { msg, data } = res
  //     reduxDispatch(setMessages(data))
  //   })
  //   this.socket.on('leaveRoom', (res: SocketResonpse) => {
  //     NotifyGenerator.generateNotify(res.msg)
  //     reduxDispatch(setInChat(false))
  //     reduxDispatch(setRoomInfo({
  //       room: { name: '' },
  //       members: [],
  //       messages: [],
  //     }))
  //     focusElement('canvas')
  //   })
  //   this.socket.on('enterRoom', (res: SocketResonpse) => {
  //     NotifyGenerator.generateNotify(res.msg)
  //     reduxDispatch(setInChat(true))
  //     focusElement('chatinput')
  //   })
  //   this.socket.on('frameInfo', (res: SocketResonpse) => {
  //     // console.log(new Map(res?.data))
  //     this.currentFrame = new Map(res?.data)
  //     // check if there is new role added here
  //     for (let key of this.currentFrame.keys()) {
  //       const frame = this.currentFrame.get(key)
  //       if (!this.roleUID.has(key)) {
  //         // new role
  //         this.roleUID.add(key)
  //         const role = generateNewRole(frame.uid, frame.username, frame.socketId)
  //         console.log('new', frame.username)
  //         role.status = frame.status
  //         role.offsetX = role.status.offsetX
  //         role.offsetY = role.status.offsetY
  //         this.roles.push(role)
  //         // console.log('new')
  //         // if (key != this.getSocketId()) role.renderSelfByFrame(key, r)
  //       }
  //     }
  //     for (let role of this.roles) {
  //       const frame = this.currentFrame.get(role.userId)
  //       if (frame) role.status = frame.status
  //     }
  //   })
  //   this.socket.on('toLeave', (res: SocketResonpse) => {
  //     let str = 'User has left: '
  //     for (let i of res.data) {
  //       str += i + ' '
  //     }
  //     NotifyGenerator.addMessage(str)
  //     this.roles.filter(role => !res.data.includes(role.userId))
  //   })
  // }

  // renderAll (mySocketId: string) {
  //   for (let role of this.roles) {
  //     if (role.socketId != mySocketId) {
  //       // console.log(role.socketId, mySocketId)
  //       role.renderSelfByFrame(role)
  //     }
  //   }
  // }

  // getAllFrames () {
  //   return this.roles
  // }

  // getLast (arr: any[]) {
  //   return !arr || arr.length == 0 ? null : arr[arr.length-1]
  // }

  // sendMessage (data: { input: string, rid: string }) {
  //   this.socket.emit('sendText', data)
  // }

  // close () {
  //   console.log('close', this.socket)
  //   this.socket.emit('close', {})
  //   this.socket = null
  //   MapSocket.accessed = false
  // }

  // joinRoom (roomId: string = 'room1') {
  //   console.log('join ', roomId)
  //   this.socket.emit('joinRoom', roomId)
  // }

  // leaveRoom (roomId: string) {
  //   this.socket.emit('leaveRoom', roomId)
  // }

  // submitRoleStatus (status: RoleStatus) {
  //   this.socket.emit('frameStatus', status)
  // }

}