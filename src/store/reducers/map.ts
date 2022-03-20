import { User } from '../../config/types'

const initialState = {
  inChat: false,
  roomInfo: {
    room: { name: '' },
    members: [],
    messages: [],
  },
  baseVelocity: 5,
  tickInterval: 33,
}

interface Map {
  inChat: boolean,
  roomInfo: {
    room: { name: string },
    members: any[],
    messages: any[]
  },
  baseVelocity: number,
  tickInterval: number,
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