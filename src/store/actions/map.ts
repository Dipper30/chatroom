import { User } from '../../config/types'
import api from '../../request'
import { bindActionCreators } from 'redux'

export const setInChat = (data: boolean) => ({ type: 'toggleChat', data })
export const setRoomInfo = (data: any) => ({ type: 'setRoomInfo', data })
export const setMessages = (data: any) => ({ type: 'setMessages', data })

export const toggleInChat = (data: boolean) => {
  return (dispatch: any) => {
    dispatch(setInChat(data))
  }
}


// async function
// export const loginAsync = (data: any) => {
//   return async (dispatch: any) => {
//     const res = await api.login(data)
//     if (res.data) {
//       dispatch(setInCHat())
//     }
//     return res.data
//   }
// }