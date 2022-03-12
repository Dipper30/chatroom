/* eslint-disable no-invalid-this */
import { getTS } from '../utils/tools'
import { AuthService, ChatRoomService } from '../service'

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
    if (socket?.rooms?.size >= 2) {
      // already in a room
      io.emit('notify', 'already in a room')
      return
    }
    let sockets = await io.in(rid).fetchSockets()
    console.log('join ', rid)
    socket.join(rid)
    if (sockets.length == 0) {
      // no member in this room
      // generate new chatroom
      console.log('create', sockets.length)
      
      const created = await ChatRoomService.createChatRoom(socket.uid, rid)

    }
    // console.log('sockets' ,sockets.length)
    // const created = await ChatRoomService.createChatRoom(rid)
    const info = await getRoomInfo(rid)
    io.in(rid).emit('roomInfo', { msg: 'new member '+ socket.id, data: info })
    const msg = await ChatRoomService.getMessages(rid)
    // console.log('@@@@@text ', msg)
    if (msg) io.in(rid).emit('updateMessages', { msg: 'ok', data: msg })
  }

  const leaveRoom = async (rid: string) => {
    console.log('leave ', rid)
    socket.leave(rid)
    let sockets = await io.in(rid).fetchSockets()
    if (sockets.length == 0) {
      // nobody here, delete the chatroom
      const deleted = await ChatRoomService.deleteChatRoom(rid)

    }
    const info = await getRoomInfo(rid)
    io.in(rid).emit('roomInfo', { msg: 'new member '+ socket.id, data: info })

  }

  const getAllMembers = async (rid: string) => {
    let uids = await io.in(rid).fetchSockets()
    uids = uids.map((i: any) => Number(i.uid))
    // console.log(uids)
    const users = await AuthService.getAllUserInfo(uids)
    return users
  }

  const disconnecting = () => {
    console.log('disconnecting.. ', socket.id)
    notifyFriendsOfDisconnect(socket)
  }

  const disconnect = () => {
    const sid = socket.id
    console.log('disconnect', sid)
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

  socket.on('disconnecting', disconnecting)
  socket.on('disconnect', disconnect)
  socket.on('sendText', sendText)
  socket.on('message', receiveMessage)
  socket.on('add', receiveMessage)
  // socket.on('createChatRoom', createChatRoom)
  socket.on('joinRoom', joinRoom)
  socket.on('leaveRoom', leaveRoom)
}

export default handler