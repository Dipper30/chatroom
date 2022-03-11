import { errCode } from '../config'
import { ChatRoomException } from '../exception'
import { Exception } from '../types/common'
import { getUnixTS } from '../utils/tools'
import BaseService from './BaseService'
const models = require('../../db/models/index.js')
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  ChatRoom: ChatRoomModel,
  Message: MessageModel,
  // Home_Customer,
  // Business_Customer,
  // Admin: AdminModel,
  // Access: AccessModel,
} = models

class ChatRoom extends BaseService {
  constructor () {
    super()
  }

  async createChatroom (params: { uid: number, name: string }) {
    // const time: number = getUnixTS()
    const uuid = uuidv1()
    try {
      const cr = await ChatRoomModel.create({ ...params, uuid })
      return cr
    } catch (error) {
      return error
    }
  }

  /**
   * find all ussers currently in the chatroom
   * @param {uuid} cid 
   * @returns 
   */
  async getAllUsersInChatRoom (cid: any) {
    try {
      console.log('@@@@@@@@',typeof cid, cid)
      const users = await UserModel.findAll({
        where: {
          chatroomId: cid,
        },
      })
      console.log(users)
      const chatroom = await ChatRoomModel.findByPk('b0b45ff0-9f94-11ec-9f8c-ffce63e7528f')
      console.log('@@@@@@@@@@@@@', chatroom)
      return [chatroom, users]
    } catch (error) {
      return error
    }
  }

  /**
   * User send a message to chatroom
   * @param {number} uid 
   * @param {string} content 
   * @param cid 
   * @returns {Boolean} if the message has been added successfully
   */
  async sendMessage (uid: number, content: string, cid: string): Promise<any> {
    try {
      // check if the user is in chatroom
      console.group('?lllllllll',uid, cid)
      const user = await UserModel.findOne({
        where: {
          id: uid,
          chatroomId: cid,
        },
      })

      console.log('@@@@@', user)
      if (!user) throw new ChatRoomException(errCode.CHATROOM_ERROR, 'User Not in Room!')
      const currentTime = getUnixTS()
      const msg = await MessageModel.create({
        uid,
        content,
        cid,
        createTime: currentTime,
      })
      return true
    } catch (error) {
      return error
    }
  }

  async getMessage (uid: number): Promise<any> {
    try {
      // check if the user is in chatroom
      const user = await UserModel.findByPk(uid)
      const cid = user.chatroomId
      if (!cid) return []

      const msg = await MessageModel.findAll({
        where: {
          cid,
        },
        include: [
          {
            model: UserModel,
            as: 'User',
          },
        ],
      })
      return msg
    } catch (error) {
      return error
    }
  }

}

export default new ChatRoom()