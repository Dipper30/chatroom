import { role } from '../config/auth'
import { Account } from '../types/common'
import { AccountInfo } from '../types/User'
import BaseService from './BaseService'
import { encryptMD5 } from '../utils'
// import { UserException } from '../exception'
import { errCode } from '../config'
import { AuthException } from '../exception'

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
import { Op } from 'sequelize'
const {
  User: UserModel,
  // Home_Customer,
  // Business_Customer,
  // Admin: AdminModel,
  // Access: AccessModel,
} = models

// const Op = Sequelize.Op

class Auth extends BaseService {

  constructor () {
    super()
  }

  async findAccountByUserID (uid: number): Promise<any> {
    try {
      const hasAccount = await UserModel.findByPk(uid)
      // const hasAccount = await UserModel.findOne({
      //   where: { username },
      // })
      return hasAccount
    } catch (error) {
      return false
    }
  }

  // async findAccountByUsername (username: string): Promise<Boolean> {
  //   try {
  //     //TODO ignore case
  //     const lowerUsername = username.toLowerCase()
  //     const hasAccount = await UserModel.findOne({
  //       where: { 
  //         username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), lowerUsername),
  //       },
  //     })
  //     // const hasAccount = await UserModel.findOne({
  //     //   where: { username },
  //     // })
  //     return Boolean(hasAccount)
  //   } catch (error) {
  //     return false
  //   }
  // }

  // async addAccount (params: AccountInfo) {
  //   // const t = await sequelize.transaction()
    
  //   try {
  //     // transaction
  //     // create user
  //     const user = await UserModel.create(
  //       {
  //         username: params.username,
  //         password: encryptMD5(params.password),
  //       },
  //       // { transaction: t },
  //     )

  //     // await t.commit()
  //     return user
  //   } catch (error) {
  //     // something wrong
  //     // await t.rollback()
  //     return false
  //   }
  // }

  async ifHasAccount (uid: number): Promise<any> {
    try {
      const user = await UserModel.findByPk(uid)
      if (!user) return false
      else return user
    } catch (error) {
      return error
    }
    
  }

  async loginAccount (params: Account) {
    let { username, password } = params
    const p: string = encryptMD5(password)
    const lowerUsername: string = username.toLowerCase()
    try {
      const user = await UserModel.findOne({
        where: { 
          username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), lowerUsername),
        },
      })
      // const user = await UserModel.findOne({
      //   where: {
      //     username,
      //   },
      // })
      if (!user) {
        const created = await UserModel.create({
          username,
          password: p,
          chatroomId: 'b0b45ff0-9f94-11ec-9f8c-ffce63e7528f',
        })
        return created
      } else {
        if (p != user.password) throw new AuthException(errCode.AUTH_ERROR, 'Wrong Password')
        else return user
      }
    } catch (error) {
      return error
    }
  }

  async getAllUserInfo (uids: number[]) {
    try {
      const users = await UserModel.findAll({
        where: {
          id: {
            [Op.in]: uids,
          },
        },
      })
      return users
    } catch (error) {
      console.log(error)
    }
  }

  // async getUserInfo (query: { uid: number }) {
  //   try {
  //     const { uid } = query
  //     const user = await UserModel.findByPk(uid, {
  //       attributes: [
  //         'id',
  //         'role_id',
  //         'username',
  //       ],
  //     })
  //     let detail: any
  //     if (user.role_id == role.ADMIN) {
  //       detail = await AdminModel.findOne({
  //         where: {
  //           uid: user.id,
  //         },
  //       })
  //     } else if (user.role_id == role.HOME_CUSTOMER) {
  //       detail = await Home_Customer.findOne({
  //         where: {
  //           uid: user.id,
  //         },
  //       })
  //     } else if (user.role_id == role.BUSINESS_CUSTOMER) {
  //       detail = await Business_Customer.findOne({
  //         where: {
  //           uid: user.id,
  //         },
  //       })
  //     }
  //     const [accesses, metadata] = await sequelize.query(`select type from Access_Roles join Accesses on aid = Accesses.type where rid = ${user.role_id};`)
  //     const auth = Array.from(accesses).map((ac: any) => ac.type)
  //     const result = omitFields({ ...user.dataValues, ...detail.dataValues }, ['id', 'password'])
  //     return {
  //       ...result,
  //       auth,
  //     }
  //   } catch (error) {
  //     return error
  //   }
  // }

}

export default new Auth()