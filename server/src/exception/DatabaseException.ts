import { errCode } from '../config'
import BaseException from './BaseException'

class DatabaseException extends BaseException {

  constructor (code: number = errCode.DATABASE_ERROR, message?: string) {
    super(code, message)
  }
}

export default DatabaseException