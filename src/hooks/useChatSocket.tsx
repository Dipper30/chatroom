import React, { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import config from '../config'

interface ChatFunction {
  setMsg: Function,
}

const useChatSocket = (fn: ChatFunction): Socket => {
  const initialSocket: any = null 
  // TODO: set timeout if connect is refused
  // return new Promise((resolve, reject) => {
  //   const newSocket: any = io(config.SERVER_URL)
  //   const connectErrorTimeout = setTimeout(() => {
  //     reject()
  //   }, config.CONNECTIONTIMEOUT)
  //   newSocket.once('connect', () => {
  //     clearTimeout(connectErrorTimeout)
  //     newSocket.on('message', (data: string) => {
  //       fn.setMsg(data)
  //     })
  //     setSocket(newSocket) // Set the socket
  //     resolve(newSocket) // Return the socket
  //   })
  // })
  const [socket, setSocket] = useState<any>(initialSocket)
  useEffect(() => {
    if (!socket) {
      const newSocket: any = io(config.SERVER_URL)
      newSocket.on('message', (data: string) => {
        fn.setMsg(data)
      })
      setSocket(newSocket)
    }
    
    return () => socket ? socket.close() : {}
  }, [socket])
  return socket
}

export default useChatSocket