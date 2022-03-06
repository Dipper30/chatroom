import { errCode } from '../config'
import BaseException from './BaseException'

class ParameterException extends BaseException {

  constructor (code: number = errCode.PARAMETER_ERROR, message?: string) {
    super(code, message)
  }
}

export default ParameterException