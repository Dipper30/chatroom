// import { createContext, useState } from 'react'
// import config from '../config'
// import { io } from 'socket.io-client'

// const SocketContextProvider: React.FC = (props) => {
//   const initialSocket: any = null 
//   const [socket, setSocket] = useState(initialSocket)

//   const connectSocket = async () => {
//     if (socket) {
//       return Promise.resolve(socket) // If already exists resolve
//     }
//     return new Promise((resolve, reject) => {
//       const newSock: any = io(config.SERVER_URL)
//       const connectErrorTimeout = setTimeout(() => {
//         reject()
//       }, config.CONNECTIONTIMEOUT)
//       newSock.once('connect', () => {
//         clearTimeout(connectErrorTimeout)
//         setSocket(newSock) // Set the socket
//         resolve(newSock) // Return the socket
//       })
//     })
//   }

//   return (
//     <SocketContext.Provider value={ socket }>
//       {props.children}
//     </SocketContext.Provider>
//   )
// }

// export default SocketContextProvider