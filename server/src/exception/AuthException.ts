import { errCode } from '../config'
import BaseException from './BaseException'

class AuthException extends BaseException {

  constructor (code: number = errCode.AUTH_ERROR, message?: string) {
    super(code, message)
  }
}

export default AuthException