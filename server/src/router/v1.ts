import { Router } from 'express'

import { 
//   ActivityController,
  AuthController,
  ChatRoomController,
//   CommentController,
//   GreetingController,
//   // ConfigController,
} from '../controller'

import {
  AuthValidator,
  ChatRoomValidator,
} from '../validator'
// import MessageController from '../controller/MessageController'

const router: Router = Router()

// auth
router.post('/login', AuthValidator.checkLogin, AuthController.login)
// router.post('/login', AuthController.login)
// router.post('/token', AuthController.getUserInfo)

// chatroom
router.post('/createChatroom', ChatRoomValidator.checkCreate, ChatRoomController.createChatroom)

// message
router.get('/getMessage', ChatRoomController.getMessage)

// router.post('/postGreeting', GreetingController.postGreeting)
// router.post('/likeGreeting', GreetingController.likeGreeting)
// router.post('/reportGreeting', GreetingController.reportGreeting)
// router.post('/postComment', CommentController.postComment)
// router.post('/deleteComment', CommentController.deleteComment)
// router.post('/deleteGreeting', GreetingController.deleteGreeting)

// router.get('/greetings', GreetingController.getGreetings)

// // messages
// router.get('/messages', MessageController.getMessages)
// router.post('/message', MessageController.postMessage)
// router.post('/checkMessage', MessageController.checkMessage)
// router.post('/feedback', MessageController.postFeedback)

// // activity
// router.post('/addActivity', ActivityController.addActivity)
// router.post('/deleteActivity', ActivityController.deleteActivity)
// router.post('/participate', ActivityController.participate)
// router.get('/checkParticipation', ActivityController.checkParticipation)

module.exports = router