const express = require('express')
const app = express()
const httpServer = require('http')
const https = require('https')
const router = require('./router/index.ts')
const fs = require('fs')
const fileUpload = require('express-fileupload') // parse uploaded file

import { createSocket, useSocketRouter } from './socket'
import SocketFrame from './socket/SocketFrame'

import { Exception } from './types/common'
require('dotenv').config()

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 5 } })) // <= 5MB
app.use(express.static('build'))

// const http = require('http')
// const server = http.createServer(app)
const server = https.createServer({
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
}, app)

// const server = httpServer.createServer(app)
const io: any = createSocket(server)
const socketFrame = SocketFrame.getInstance(io.of('/map1'))
socketFrame.startFrameUpdate()

app.get('*', async (req: any, res: any, next: any) => {
  console.log(req.url)
  if (req.url.substring(0, 10) == 'socket.io') {
    next()
  } else if (req.url.substr(0, 4) == '/api') {
    next()
  } else {
    // res.writeHead(200, {
    //   'Content-Type': 'text/html',
    // })
    // res.end('build/index.html')
    fs.readFile('build/index.html', (err: any, data: any) => {
      if (err) {
        res.writeHead(404)
        res.end(JSON.stringify(err))
        return
      }
      res.writeHead(200)
      res.end(data)
    })
  }
})

app.all('*', async (req: any, res: any, next: any) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  // console.log('get', allowOrigin)
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, token') // with token
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // with cookies
  res.header('X-Powered-By', 'Express')

  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// check token
// app.use('/', async (req: any, res: any, next: any) => {
//   console.log(req.url)
//   // if ( tokenFreeUrls.includes(req.url) ) {
//   //   next()
//   //   return
//   // }
//   const token = String(req.headers.token)
//   if ( !token || token == 'undefined' ) {
//     res.status(200).json({
//       code: 10002,
//       msg: 'Token Failure',
//     })
//   } else {
//     next()
//   }
// })

router(app)

// catch exception and log out error message
app.use((err: Exception, req: any, res: any, next: any) => {
  if (err) {
    let status = err.code ? 200 : 500
    res.status(status).json({
      code: err.code || 500,
      msg: err.message || 'Bad Request',
    })
  }
})

server.listen(3000, '0.0.0.0', () => {
  console.log('hello Chat')
})

// console.log(process.env.INTERVAL)