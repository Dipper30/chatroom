
import env from '../../config'
import { getRoomId, getUID } from '../../service/utils'
import GameSocket from '../socket/GameSocket'
const { RTCPeerConnection, RTCSessionDescription } = window
const Peer = require('simple-peer')

let localStream: MediaStream
const peers: any = {}
let myVideo: HTMLVideoElement

let peer: any = new Peer({ initiator: true })
const peer2 = new Peer()

peer.on('signal', (data: any) => {
  console.log('on signal', data)
  // for (const uid in peers) {
  //   if (uid != getUID()) {
  //     peers[uid].signal(data)
  //   }
  // }
  // peer2.signal(data)
})

peer.on('stream', (stream: MediaStream) => {
  // got remote video stream, now let's show it in a video tag
  console.log('on stream!!')
  const video = document.createElement('video')
  addVideoStream(video, stream)
})

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
    const gameSocket = GameSocket.getInstance()
    gameSocket.joinChat()
    addMedia(localStream)
    
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
  const newPeer = new Peer({ initiator: true, stream: myStream })

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