import { errCode } from '../config'
import { Exception, ExceptionConfig } from '../types/common'

/**
 * Two ways to create an instance of a new Exception
 * 1. new XXXException(code)
 * The [message] will be formed according to code
 * 2. new XXXException(code, message)
 * The [message] will be rewritten
 */
class BaseException extends Error implements Exception {

  code: number
  message: string
  config: ExceptionConfig = {
    500: 'Bad Request!',
    [errCode.USER_ERROR]: 'Staff Error!',
    [errCode.USER_EXISTS]: 'Oops! It seems you had a shadow...!',
    [errCode.REGISTRATION_ERROR]: 'Registration Error!',
    [errCode.LOGIN_ERROR]: 'Login Error',
    [errCode.TOKEN_ERROR]: 'Oops! Something seems wrong with your token...',
    [errCode.ACCESS_ERROR]: 'Oops! You are not authorized...',
    [errCode.AUTH_ERROR]: 'Auth Error!',
    [errCode.FILE_ERROR]: 'File Error',
    [errCode.NO_FILE_UPLOADED]: 'No file is uploaded',
    [errCode.FILE_TYPE_ERROR]: 'File Type Error.',
    [errCode.DIR_BUILD_ERROR]: 'Directory Failure',
    [errCode.DIR_NOT_EXISTS]: 'Directory Not Exists',
  }

  constructor (code: number = 500, message?: string) {
    super()
    this.code = code
    if (message) this.message = message
    else this.message = this.config[this.code] || 'Bad Request'
  }

}

export default BaseException