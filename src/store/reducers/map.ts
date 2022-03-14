import { User } from '../../config/types'

const initialState = {
  inChat: false,
  roomInfo: {
    room: { name: '' },
    members: [],
    messages: [],
  },
}

interface Map {
  inChat: boolean,
  roomInfo: {
    room: { name: string },
    members: any[],
    messages: any[]
  },
}

const mapReducer = (preState: Map = initialState, action: any) => {
  const { type, data } = action
  switch (type) {
  case 'toggleChat':
    return { ...preState, inChat: data }
  case 'setRoomInfo':
    console.log('set', { ...preState, roomInfo: data })
    return { ...preState, roomInfo: data }
  case 'setMessages':
    console.log('set', { ...preState, messages: data })
    return { ...preState, messages: data }
  default:
    return preState
  }
}

export default mapReducer