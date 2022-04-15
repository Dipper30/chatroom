
import env from '../../config'
import { getRoomId, getUID } from '../../service/utils'
import GameSocket from '../socket/GameSocket'
const { RTCPeerConnection, RTCSessionDescription } = window
const Peer = require('simple-peer')

const configuration = {
  // Using From https://www.metered.ca/tools/openrelay/
  "iceServers": [
  {
    urls: "stun:openrelay.metered.ca:80"
  },
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject"
  },
  {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject"
  },
  {
    urls: "turn:openrelay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject"
  }
]
}

let localStream: MediaStream
export const peers: any = {}
let myVideo: HTMLVideoElement

let peer: any = new Peer({ initiator: true})

// peer.on('signal', (data: any) => {
//   console.log('on signal', data)
//   // for (const uid in peers) {
//   //   if (uid != getUID()) {
//   //     peers[uid].signal(data)
//   //   }
//   // }
//   // peer2.signal(data)
// })

// peer.on('stream', (stream: MediaStream) => {
//   // got remote video stream, now let's show it in a video tag
//   console.log('on stream!!')
//   const video = document.createElement('video')
//   addVideoStream(video, stream)
// })

// peer2.on('signal', (data: any) => {
//   peer.signal(data)
// })

// peer2.on('stream', (stream: MediaStream) => {
//   // got remote video stream, now let's show it in a video tag
//   console.log('on stream!!')
//   const video = document.createElement('video')
//   addVideoStream(video, stream)
// })

const addMedia = (stream: MediaStream) => {
  peer.addStream(stream) // <- add streams to peer dynamically
  addVideoStream(myVideo, stream)
}

export const closeChatting = () => {
  myVideo && myVideo.remove()
  localStream && localStream.getTracks().forEach((track) => {
    track.stop()
  })
  
  const gameSocket = GameSocket.getInstance()
  gameSocket.leaveChat()

  // peer = (null) as any
}

export const startChatting = (peerUrl: string = 'chatter', data: { userId: number }) => {
  console.log('start')
  const { userId } = data
  myVideo = document.createElement('video')
  myVideo.muted = true
  
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((myStream: MediaStream) => {
    // add myself
    localStream = myStream
    myVideo.srcObject = myStream
    const videoContainer = document.getElementById('video-container')
    videoContainer?.append(myVideo)
    myVideo.addEventListener('loadedmetadata', () => {
      myVideo.play()
    })
    console.log('my video', videoContainer)
    const gameSocket = GameSocket.getInstance()
    gameSocket.joinChat()
    // addMedia(localStream)
    
  }).catch((err) => {
    console.error('Failed to get local stream', err)
  })
}

const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
  const videoContainer = document.getElementById('video-container')
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  console.log(videoContainer)
  videoContainer && videoContainer.append(video)
}
// }

// export default GamePeer

export const connectToNewUser = (userId: number, myStream: MediaStream = localStream) => {
  //
  const newPeer = new Peer({ initiator: true, stream: myStream, trickle: false })

  newPeer.on('signal', (data: any) => {
    console.log('new peer on signal')
    peer.signal(data)
  })
  console.log(newPeer)

  newPeer.on('stream', (stream: MediaStream) => {
    // got remote video stream, now let's show it in a video tag
    console.log('on stream!!')
    const video = document.createElement('video')
    addVideoStream(video, stream)
  })

  peers[userId] = newPeer
}

/**
 * Remove a peer with given socket_id. 
 * Removes the video element and deletes the connection
 * @param {number} uid
 */
export const removePeer = (uid: number) => {
  const peer = peers[uid]
  const video = peer?.video || null
  video && video.remove()
  peer && peer.peer?.destroy()
  delete peers[uid]
}

/**
 * Creates a new peer connection and sets the event listeners
 * @param {String} socket_id 
 *                 ID of the peer
 * @param {Boolean} am_initiator 
 *                  Set to true if the peer initiates the connection process.
 *                  Set to false if the peer receives the connection. 
 */
export const addPeer = (uid: number, am_initiator: boolean) => {
  console.log('add ', uid)
  peers[uid] = {
    peer: new Peer({
      initiator: am_initiator,
      stream: localStream,
      config: configuration,
    }),
    video: document.createElement('video'),
  }

  peers[uid].peer.on('signal', (data: any) => {
    const gameSocket = GameSocket.getInstance()
    gameSocket.signal(uid, data)
  })

  peers[uid].peer.on('stream', (stream: MediaStream) => {
    const video = peers[uid].video
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    const videoContainer = document.getElementById('video-container')
    videoContainer?.append(video)
  })
}