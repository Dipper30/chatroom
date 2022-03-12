import BaseController from './BaseController'
import { AuthService, ChatRoomService } from '../service'
import { isError } from '../utils/tools'
import { errCode } from '../config'
import { ChatRoomException, TokenException } from '../exception'
import { NextFunction, Request, Response } from 'express'
import { TokenService } from '../service'

class ChatRoom extends BaseController {
  async createChatroom (req: any, res: any, next: any): Promise<any> {
    try {
      const data: { uid: number, name: string } = req.body
      
      const userExists: any = await AuthService.ifHasAccount(data.uid)
      if (!userExists) throw new ChatRoomException(errCode.CHATROOM_ERROR, 'Invalid User Id: User Not Found!')
      
      const chatRoom: any = await ChatRoomService.createChatRoom(data.uid, data.name)
      if (isError(chatRoom)) throw chatRoom

      res.json({
        code: 201,
        message: 'created',
        data: {
          chatRoom,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getMessage (req: any, res: any, next: any) {
    try {
      const Token = new TokenService(req.headers.token)
      const { userID } = Token.verifyToken()

      if (!userID) throw new TokenException()
      
      const messages: any = await ChatRoomService.getMessage(Number(userID))
      if (isError(messages)) throw messages

      res.json({
        code: 200,
        message: 'ok',
        data: {
          messages,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  // async sendMeesage (uid: number, content: string, cid: any): Promise<any> {
  //   try {
  //     const data: { uid: number, name: string } = req.body
      
  //     const userExists: any = await AuthService.ifHasAccount(data.uid)
  //     if (!userExists) throw new ChatRoomException(errCode.CHATROOM_ERROR, 'Invalid User Id: User Not Found!')
      
  //     const chatRoom: any = await ChatRoomService.createChatroom(data)
  //     if (isError(chatRoom)) throw chatRoom

  //     res.json({
  //       code: 201,
  //       message: 'created',
  //       data: {
  //         chatRoom,
  //       },
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}

export default new ChatRoom()