import { Server as ServerType } from 'http'
import { Socket } from 'net'
// import { onRouter, emitRouter, SocketRouter } from './router'

const { Server } = require('socket.io')

export const createSocket = (server: ServerType): any => {
  const socket = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  socket.on('connection', (socket: any) => {
    console.log('connected!')
    useSocketRouter(socket)
  })
  
  return socket
}

export const useSocketRouter = (socket: any) => {
  // for (let r of onRouter) {
  //   socket.on(r.route, r.callback)
  // }
  socket.on('message', (data: any) => {
    socket.emit('message', data + ' Received!!')
  })
  socket.on('connect_error', (err: any) => {
    console.log(`connect_error due to ${err.message}`)
  })
 
}
