const BaseValidator = require('./BaseValidator')
import { isBetween, createError } from '../utils/validate'
import v from 'validator'

class AuthValidator extends BaseValidator {

  errMessage = ''

  // type check
  rules = [
    'username|string|required',
    'password|string|required',
    'id|number',
  ]

  constructor () {
    super()
  }

  checkAuthParam (): Boolean {
    if (!this.checkParams(this.params, this.rules)) return false
    
    return this.checkParams(this.params, this.rules)
      && this.isBetween(this.params.username, 2, 10)
      && this.isBetween(this.params.password, 6, 18)
  }

  async checkLogin (req: any, res: any, next: any): Promise<any> {
    try {
      const { username, password } = req.body
      if (!(v.isAlphanumeric(username) && isBetween(username, 4, 12))) {
        throw createError('Username should be alphabeticnumeric with length 4 ~ 12.') 
      }
      if (!(/^[a-z0-9A-Z_-]+$/i.test(password) && isBetween(password, 6, 18))) {
        throw createError('Password can only contain a-z 0-9 A-Z _ - and length is between 6 ~ 18.') 
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  checkAccountParam (): Boolean {
    const aRule = [
      'username|string|required',
      'password|string|required',
    ]
    return this.checkParams(this.params, aRule) && this.params.password.length >= 6
  }

  checkUpdate (): Boolean {
    
    return false
  }

  // check if username is valid
  checkUsername (): Boolean {
    const uRule = [
      'username|string|required',
    ]
    return this.checkParams(this.params, uRule)
  }

  checkInfo (): Boolean {
    const iRule = [
      'uid|number|required',
    ]
    return this.checkQuery(this.params, iRule)
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules)
  }
}

export default new AuthValidator()