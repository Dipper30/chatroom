import BaseController from './BaseController'
import { AccountInfo } from '../types/User'
import { AuthException, ParameterException } from '../exception'
import { errCode } from '../config'
import { AuthValidator } from '../validator'
import { AuthService, TokenService } from '../service'
import { isError } from '../utils/tools'
import { Account } from '../types/common'

class Auth extends BaseController {
  
  // async checkAccount (req: any, res: any, next: any): Promise<any> {
  //   try {
  //     const data = req.body
  //     const valid: AuthValidator = new AuthValidator(data)
  //     if (!valid.checkUsername()) throw new ParameterException()

  //     const userExists: Boolean = await AuthService.findAccountByUsername(data.username)
  //     if (userExists) throw new UserException(errCode.USER_EXISTS)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async register (req: any, res: any, next: any): Promise<any> {
  //   try {
  //     const data: AccountInfo = req.body
  //     const valid: AuthValidator = new AuthValidator(data)
  //     if (!valid.checkAuthParam()) throw new ParameterException()

  //     const userExists: Boolean = await AuthService.findAccountByUsername(data.username)
  //     if (userExists) throw new UserException(errCode.USER_EXISTS)

  //     const user: any = await AuthService.addAccount(data)
  //     if (!user) throw new DatabaseException()

  //     res.json({
  //       code: 201,
  //       msg: 'User Created!',
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async login (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Account = req.body
      console.log('??', req.body)
      // const valid: AuthValidator = new AuthValidator(data)
      // if (!valid.checkAuthParam()) throw new ParameterException()

      const user: any = await AuthService.loginAccount(data)
      if (isError(user)) throw user
      if (!user) throw new AuthException(errCode.LOGIN_ERROR, 'Wrong Username or Password I Guess...')

      // logged in, return a token
      const t = new TokenService({ userID: user.id, username: user.username })
      const token = t.generateToken()

      res.json({
        code: 200,
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  // async getInfoByToken (req: any, res: any, next: any): Promise<any> {
  //   try {
  //     const token = new TokenService(req.headers.token)
  //     const decode = token.verifyToken()
  //     if (!decode) throw new TokenException()

  //     const user = await AuthService.findAccountByUserID(decode.userID)
  //     if (!user) throw new TokenException()
  //     res.json({
  //       code: 200,
  //       data: {
  //         user,
  //       },
  //     })

  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async getUserInfo (req: any, res: any, next: any): Promise<any> {
  //   try {

  //     const token = new TokenService(req.headers.token)
  //     const { userID, username } = token.verifyToken()
  //     if (!userID || !username) throw new TokenException(10050, 'Can\'t retrieve token')
      
  //     const valid = await AuthService.findAccountByUsername(username)
  //     if (!valid) throw new TokenException(10050, 'User not exists.')

  //     res.json({
  //       code: 200,
  //       data: {
  //         id: userID,
  //         username,
  //       },
  //     })

  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async update (req: any, res: any, next: any): Promise<any> {
  //   try {
  //     const data: any = req.body
  //     const valid: AuthValidator = new AuthValidator(data)
  //     if (!valid.checkUpdate()) throw new ParameterException()

  //     const token = new TokenService(req.headers.token)
  //     const { userID } = token.verifyToken()
  //     if (!userID) throw new TokenException()
  //     if (userID != data.uid) throw new AuthException(errCode.ACCESS_ERROR)

  //     const updated = await AuthService.update(data)
  //     if (isError(updated)) throw updated

  //     res.json({
  //       code: 200,
  //       msg: 'updated',
  //     })

  //   } catch (error) {
  //     next(error)
  //   }
  // }

}

export default new Auth()