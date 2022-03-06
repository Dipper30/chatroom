import { errCode } from '../config'
import BaseException from './BaseException'

class TokenException extends BaseException {

  constructor (code: number = errCode.TOKEN_ERROR, message?: string) {
    super(code, message)
  }
}

export default TokenException