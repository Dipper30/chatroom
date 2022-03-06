import { errCode } from '../config'
import BaseException from './BaseException'

class UserException extends BaseException {

  constructor (code: number = errCode.USER_ERROR, message?: string) {
    super(code, message)
  }
}

export default UserException