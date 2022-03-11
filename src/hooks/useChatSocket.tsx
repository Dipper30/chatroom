import React, { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import config from '../config'
import { getMessage } from '../request/config'
import { handleResult } from '../service/utils'

interface ChatFunction {
  setMsg: Function,
  setMessageList: Function,
  setChatroom: Function,
  setUsers: Function,
}

const useChatSocket = (fn: ChatFunction): Socket => {
  const initialSocket: any = null 
  const initialMessageList: any = []
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
      newSocket.on('loadMessage', async (data: any) => {
        // pull messages
        const res = await getMessage()
        if (handleResult(res, false)) {
          fn.setMessageList(res.data.messages)
        }
      })
      newSocket.on('roomInfo', async (data: any) => {
        // pull messages
        const [chatroom, users] = data
        console.log('room1 ', data)
        fn.setChatroom(chatroom)
        fn.setUsers(users)
      })
      setSocket(newSocket)
    }
    
    return () => socket ? socket.close() : {}
  }, [socket])
  return socket
}

export default useChatSocket