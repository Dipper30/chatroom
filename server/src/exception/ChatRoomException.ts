import { errCode } from '../config'
import BaseException from './BaseException'

class ChatRoomException extends BaseException {

  constructor (code: number = errCode.CHATROOM_ERROR, message?: string) {
    super(code, message)
  }
}

export default ChatRoomException