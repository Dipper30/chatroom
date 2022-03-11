import { AccountInfo } from '../types/User'

const jwt = require('jsonwebtoken')
import { keys } from '../config'

class Token {

  data: any

  constructor (data: any) {
    this.data = data
  }

  generateToken () {
    const data: { userID: number, username: string } = this.data
    // const created = Math.floor(Date.now() / 1000)
    
    let token = jwt.sign({ ...data }, keys.TOKEN_PRIVATE_KEY, { expiresIn: keys.TOKEN_EXPIRE_IN })
    return token
  }

  verifyToken (authPoint?: number|undefined): any {
    const token = this.data
    try {
      const res: { userID: number, username: any, iat: any, exp: number} = jwt.verify(token, keys.TOKEN_PRIVATE_KEY) || {}
      const { userID, username, iat, exp = 0 } = res
      const current = Math.floor(Date.now() / 1000)
      // if current timestamp is larger than the expire time, return false
      if (current > exp) return false
      // if (authPoint && !auth.includes(authPoint)) return false
      return res
    } catch (error) {
      return false
    }
  }
}

export default Token