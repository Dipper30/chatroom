const BaseValidator = require('./BaseValidator')
import { isBetween, createError, isPositiveInteger } from '../utils/validate'
import v from 'validator'

class ChatRoomValidator extends BaseValidator {
  constructor () {
    super()
  }
  
  async checkCreate (req: any, res: any, next: any): Promise<any> {
    try {
      const { uid, name } = req.body
      if (!isPositiveInteger(uid)) {
        throw createError('Invalid User Id') 
      }
      if (!(v.isAlphanumeric(name) && isBetween(name, 3, 15))) {
        throw createError('Name can only contain a-z 0-9 A-Z and length is between 3 ~ 15.') 
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new ChatRoomValidator()