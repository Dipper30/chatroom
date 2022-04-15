/* eslint-disable no-invalid-this */
import { getTS } from '../utils/tools'
import { AuthService, ChatRoomService } from '../service'
import SocketFrame, { UserFrameInfo } from './SocketFrame'
import { peers } from './index'
const { v4: uuidV4 } = require('uuid')

const ROOM1: string = 'room1'
const ROOM2: string = 'room2'
const registeredRooms: string[] = [ROOM1, ROOM2]

interface RoomInfo {

}

const handler = (io: any, socket: any) => {

  const receiveMessage = () => {
    console.log('receive @@@@', socket.id)
  }

  const getAllRooms = async () => {
    io.emit('broadcastRoomInfo', registeredRooms)
    const allRoomInfo: any[] = []
    registeredRooms.forEach(async room => {
      const roomInfo = {
        room: {
          name: room,
        },
        members: [],
      }
      const members = await getAllMembers(room)
      roomInfo.members = members
      allRoomInfo.push(roomInfo)
    })
    return allRoomInfo
    // io.broadcast('members', { msg: 'new member '+ socket.id, data: allRoomInfo })
  }

  const getRoomInfo = async (rid: string) => {
    const info = {
      room: {
        name: rid,
      },
      members: [],
    }
    const members = await getAllMembers(rid)
    info.members = members
    return info
    // io.in(rid).broadcast('roomInfo', { msg: 'new member '+ socket.id, data: info })
  }

  const sendText = async ( { input, rid }: {input: string, rid: string} ) => {
    console.log('send!!!!!', rid)
    const rr = await ChatRoomService.sendMessage(socket.uid, input, rid)
    // now load updated messages
    const msg = await ChatRoomService.getMessages(rid)
    // console.log('@@@@@text ', msg)
    if (rr && msg) io.in(rid).emit('updateMessages', { msg: 'ok', data: msg })

    // socket.broadcast.emit('loadMessage')
    // socket.emit('loadMessage')
  }
  
  const createChatRoom = async () => {
    if (socket.rooms.size >= 2) {
      // already in a room
      io.emit('notify', 'already in a room')
      return
    }
    const ts = getTS()
    const roomId = `${ts}${socket.id}`
    registeredRooms.push(roomId)
    socket.join(roomId)
    // console.log('current socket ', socket.id, ' has ', socket.rooms, 'rooms', ' ')
    io.emit('broadcastRoomInfo', registeredRooms)
    const members = await getAllMembers(roomId)
    io.in(roomId).emit('members', { msg: 'new member '+ socket.id, data: members })
  }

  const joinRoom = async (rid: string) => {
    // console.log(socket.rooms)
    if (socket?.rooms?.size >= 2) {
      // already in a room
      io.emit('notify', 'already in a room')
      return
    }
    let sockets = await io.in(rid).fetchSockets()
    console.log('join ', rid)
    // console.log(io.adapter.rooms)
    socket.join(rid)
    // console.log(socket.rooms)
    io.in(socket.id).emit('enterRoom', { msg: 'You have entered room ' + rid, data: {} })
    if (sockets.length == 0) {
      const created = await ChatRoomService.createChatRoom(socket.uid, rid)
    }
    // console.log('sockets' ,sockets.length)
    // const created = await ChatRoomService.createChatRoom(rid)
    const info = await getRoomInfo(rid)
    // socket.broadcast.in(rid).emit('notify', 'new member '+ socket.id)
    io.in(rid).emit('roomInfo', { msg: 'new member '+ socket.id, data: info })
    const msg = await ChatRoomService.getMessages(rid)
    // console.log('@@@@@text ', msg)
    if (msg) io.in(rid).emit('updateMessages', { msg: 'ok', data: msg })
  }

  /**
   * relay a peerconnection signal to a specific socket
   */
  const onSignal = (data: { cid: string, signal: any, ts: number }) => {
    // console.log('sending signal from ' + socket.uid + ' to ', data)
    console.log('signal to @@@@@@ ', socket.id + data.ts)
    const { cid, ts, signal } = data
    const sid = cid.substring(0, cid.length - 13)
    io.in(sid).emit('signal', {
      msg: '',
      data: {
        cid: socket.id + ts,
        signal,
      },
    })
  }

  const leaveRoom = async (rid: string) => {
    console.log('leave ', rid)
    socket.leave(rid)
    let sockets = await io.in(rid).fetchSockets()
    if (sockets.length == 0) {
      // nobody here, delete the chatroom
      const deleted = await ChatRoomService.deleteChatRoom(rid)

    }
    socket.broadcast.in(rid).emit('notify', 'member leaves '+ socket.id)
    const info = await getRoomInfo(rid)

    io.in(rid).emit('roomInfo', { msg: 'member leaves '+ socket.id, data: info })
    io.in(socket.id).emit('leaveRoom', { msg: 'you have left the room ' + rid, data: {} })
  }

  const joinChat = async (data: { ts: number, rid: string }) => {
    const cid = socket.id + data.ts
    const rid = data.rid ? data.rid : ROOM1
    socket.broadcast.in(rid).emit('initReceive', { msg: 'init recieve', data: { cid } })
    socket.join(rid)
    /**
     * Send message to client to initiate a connection
     * The sender has already setup a peer connection receiver
     */
    socket.on('initSend', (data: { cid: string, ts: number }) => {
      // console.log('INIT SEND by ' + socket.uid + ' for ' + uid)
      const { cid, ts } = data
      const sid = cid.substring(0, cid.length - 13)
      console.log('init send ', cid.substring(cid.length - 13))
      io.in(sid).emit('initSend', { msg: 'initsend', data: { cid: socket.id + ts } })
    })
  }

  const leaveChat = async (data: { ts: number, rid: string }) => {
    const cid = socket.id + data.ts
    const rid = data.rid ? data.rid : ROOM1
    // for (const othersId in peers) {
    //   if (othersId != socket.uid) {
    //     console.log('remove peer ' + socket.uid)
    //     peers[othersId].emit('removePeer', { msg: '', data: { uid: socket.uid } })
    //   }
    // }
    socket.broadcast.in(rid).emit('removePeer', { msg: '', data: { cid } })
    socket.leave(rid)
    // socket.broadcast.in(rid).emit('leaveChat', { msg: 'member leave chat', data: { uid } })
  }

  const getAllMembers = async (rid: string) => {
    let uids = await io.in(rid).fetchSockets()
    uids = uids.map((i: any) => Number(i.uid))
    // console.log(uids)
    const users = await AuthService.getAllUserInfo(uids)
    return users
  }

  const collectFrameStatus = async (status: any) => {
    let uid = socket.uid
    const socketFrame = SocketFrame.getInstance(io)
    socketFrame.updateUserFrameInfo(
      {
        uid: uid,
        socketId: socket.id,
        username: socket.username,
        status: status,
      },
    )
  }

  const close = () => {
    console.log('close')
    const socketFrame = SocketFrame.getInstance(io)
    socketFrame.removeFrameInfo(socket.uid)
    for (let r of socket.rooms) {
      socket.leave(r)
    }
    socket.disconnect() 
  }

  const disconnecting = () => {
    console.log('disconnecting.. ', socket.id)
    notifyFriendsOfDisconnect(socket)
    const socketFrame = SocketFrame.getInstance(io)
    socketFrame.removeFrameInfo(socket.uid)
    // io.to(socket.id).emit('quit')
    
    // socket.leave()
  }

  const disconnect = () => {
    const sid = socket.id
    console.log('disconnect', sid, socket.username)
    // leaveChat({ sid: socket.id, rid: ROOM1 })
  }

  const notifyFriendsOfDisconnect = (socket: any) => {
    const allRooms = Object.keys(socket.rooms)
    allRooms.forEach(room => {
      io.to(room).emit('broadcast', socket.id + ' has left')
    })
  }

  const forceLeaveRoom = (roomId: string) => {
    io.in(roomId).socketsLeave(roomId)
  }
  socket.on('close', close)
  socket.on('disconnecting', disconnecting)
  socket.on('disconnect', disconnect)
  socket.on('sendText', sendText)
  socket.on('message', receiveMessage)
  socket.on('add', receiveMessage)
  // socket.on('createChatRoom', createChatRoom)
  socket.on('joinRoom', joinRoom)
  socket.on('leaveRoom', leaveRoom)
  socket.on('joinChat', joinChat)
  socket.on('leaveChat', leaveChat)
  socket.on('frameStatus', collectFrameStatus)
  
  socket.on('signal', onSignal)
}

export default handler