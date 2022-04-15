import { Server as ServerType } from 'http'
// import { onRouter, emitRouter, SocketRouter } from './router'
import { ChatRoomService } from '../service'
import { Server } from 'socket.io'
import resgisterMap1Router from './map1Handler'
import resgisterMap2Router from './map2Handler'

const MAP1_NAMESPACE = 'map1'
const MAP2_NAMESPACE = 'map2'
export const peers: any = {}

export const createSocket = (server: ServerType): any => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.engine.on("connection_error", (err: any) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  })

  // initialize name space
  const map1Socket = io.of(MAP1_NAMESPACE)
  const map2Socket = io.of(MAP2_NAMESPACE)

  map1Socket.on('connection', async (socket: any) => {
    console.log('map1 connected ', socket.handshake.query.username)
    socket.uid = socket.handshake.query.uid
    socket.username = socket.handshake.query.username
    const ss = await map1Socket.fetchSockets()
    // console.log(map1Socket.sockets.size, ss.length)
    peers[socket.uid] = socket
    // console.log(map1Socket.)
    // console.log(map1Socket.server)
    
    // console.log(map1Socket.sockets.get(socket.id));
    // socket.on('message', () => console.log(1+map1Socket.sockets.size))

    // map1Socket.emit('broadcast', socket.id)
    // map1Socket.emit('broadcast', `connected sokcetid: ${socket.id}`)
    resgisterMap1Router(map1Socket, socket)
  })

  map2Socket.on('connection', (socket: any) => {
    console.log('map2 connected')
    map2Socket.emit('broadcast', `connected sokcetid: ${socket.id}`)
    resgisterMap2Router(map2Socket, socket)
  })
  
  return io
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
