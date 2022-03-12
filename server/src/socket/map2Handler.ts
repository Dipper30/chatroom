/* eslint-disable no-invalid-this */
import { getTS } from "../utils/tools";

const handler = (io: any, socket: any) => {
  const receiveMessage = () => {
    console.log('@2', socket.id)
  }
  
  const createChatRoom = (socket: any) => {
    const ts = getTS()
    // console.log(socket)
    socket.join(`${ts}${socket.id}`)
  }

  socket.on('message', receiveMessage)
  socket.on('add', receiveMessage)
  socket.on('createChatRoom', createChatRoom)
}

export default handler