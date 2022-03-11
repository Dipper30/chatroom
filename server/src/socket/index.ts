import { Server as ServerType } from 'http'
// import { onRouter, emitRouter, SocketRouter } from './router'
import { ChatRoomService } from '../service'

const { Server } = require('socket.io')

export const createSocket = (server: ServerType): any => {
  const socket = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  socket.on('connection', async (socket: any) => {
    console.log('connected!')
    // let users load message
    const info = await ChatRoomService.getAllUsersInChatRoom('b0b45ff0-9f94-11ec-9f8c-ffce63e7528f')
    socket.broadcast.emit('roomInfo', info)
    socket.broadcast.emit('loadMessage')
    socket.emit('roomInfo', info)
    socket.emit('loadMessage')
    useSocketRouter(socket)

  })
  
  return socket
}

export const useSocketRouter = (socket: any) => {
  // for (let r of onRouter) {
  //   socket.on(r.route, r.callback)
  // }
  socket.on('message', async (data: any) => {
    // resolve value
    const kvs = data.split(',')
    if (kvs.length != 3) return
    const uid = kvs[0].split(':')[1]
    const msg = kvs[1].split(':')[1]
    const cid = kvs[2].split(':')[1]
    const rr = await ChatRoomService.sendMessage(uid, msg, cid)
    socket.broadcast.emit('loadMessage')
    socket.emit('loadMessage')
    // socket.emit('message', msg + ' Received!!')
  })
  socket.on('connect_error', (err: any) => {
    console.log(`connect_error due to ${err.message}`)
  })
 
}
