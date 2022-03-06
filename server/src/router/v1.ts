import { Router } from 'express'

import { 
//   ActivityController,
  AuthController,
//   CommentController,
//   GreetingController,
//   // ConfigController,
} from '../controller'

import {
  AuthValidator,
} from '../validator'
// import MessageController from '../controller/MessageController'

const router: Router = Router()

// auth
router.post('/login', AuthValidator.checkLogin, AuthController.login)
// router.post('/login', AuthController.login)
// router.post('/token', AuthController.getUserInfo)

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