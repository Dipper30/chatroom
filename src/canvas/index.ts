import BackGround from './Background'
import { NPC } from './Block'
import Role from './Role'
import { TouchBorderName, CanvasSetting, IBlock, IRole, IVelocity, RoleState, TouchBlockName, RoleStatus, UserFrameInfo } from './types'
import { focusElement, getInChat, getUser, reduxDispatch } from '../service/utils'
import reduxStore from '../store'
import { setInChat, toggleInChat } from '../store/actions/map'
import MapSocket from '../service/Socket'


let init = false

// image sources
const RoleImageSrc = require('../assets/role.png')
const BGSrc = require('../assets/bg.jpeg')
const PoliceSrc = require('../assets/police.gif')

export const createImage = (imgSrc: any) => {
  const image = new Image()
  image.src = imgSrc
  return image
}

let canvas: any
let role: Role
let c: CanvasRenderingContext2D
let bg: BackGround
let npc: NPC
const blocks: IBlock[] = []
/**
 * start canvas
 */

 const iRole: any = {
  position: {
    x: 200,
    y: 300,
  },
  size: {
    width: 50,
    height: 50,
  },
}

export const startCanvasGame = (socketId: string) => {
    console.log('start game')
    
    const socket = MapSocket.getInstance().socket
    console.log('???????/', socketId)
    init = true
    // init canvas
    canvas = document.querySelector('canvas')
    c = canvas.getContext('2d')
    canvas.width = 700
    canvas.height = 500
    // focus canvas so keyboard events can be listened
    focusElement('canvas')
    // init variables
    

    const canvasSetting: CanvasSetting = {
      canvas,
      c,
    }

    const u = getUser()
    // main role
    role = new Role(iRole, canvasSetting, RoleImageSrc, u.id, u.username, socketId)
    role.socket = socket
    role.mapSocket = MapSocket.getInstance()
    // background
    bg = new BackGround(
      { x: 0, y: 0 },
      { width: 750, height: 600 },
      canvasSetting,
      BGSrc,
    )

    npc = new NPC({ x: 478, y: 300 }, { width: 35, height: 40 }, canvasSetting, PoliceSrc, { x: 1, y: 1 })
    npc.touchEvent = function (role: Role) {
      if ((
          role.state == RoleState.LEFT
          && role.position.x - role.baseVelocity < this.position.x + this.size.width + this.touchRaius.x
          && role.position.x + role.size.width - role.baseVelocity > this.position.x + this.size.width + this.touchRaius.x
        )
        || (
          role.state == RoleState.RIGHT
          && role.position.x + role.size.width + role.baseVelocity > this.position.x - this.touchRaius.x
          && role.position.x + role.baseVelocity < this.position.x - this.touchRaius.x
        )) {
        // hit block horizontally
        // console.log('horizontal')
        role.velocity.x = 0
        role.collide()
      } else if ((
          role.state == RoleState.UP
          && role.position.y - role.baseVelocity < this.position.y + this.size.height + this.touchRaius.y
          && role.position.y + role.size.height - role.baseVelocity > this.position.y + this.size.height + this.touchRaius.y
        )
        || (
          role.state == RoleState.DOWN
          && role.position.y + role.size.height + role.baseVelocity > this.position.y - this.touchRaius.y
          && role.position.y + role.baseVelocity < this.position.y - this.touchRaius.y
      )) {
        // hit vertically
        // console.log('vertical')
        role.velocity.y = 0
        role.collide()
      }
      if (role.events.meetNPC == true) {
        // do nothing
      } else {
        this.showDialog()
        role.events.meetNPC = true
      }
    }
    blocks.push(npc)

    bg.register(npc)
    registerKeyBoardEvent(role)
    doAnimate()
  
}

export const generateNewRole = (uid: number, username: string, socketId: string) => {
  return new Role(iRole, { canvas, c }, RoleImageSrc, uid, username, socketId)
}

export const pureUpdate = () => {
  bg.draw()
}

export const showDialog = () => {
  console.log('show dialog')
  return 1
}

export const getBgPosition = () => {
  return bg.position
}

export const renderCanvas = (frame: Map<string, UserFrameInfo>) => {
  // render other players
}

/**
 * role leaves npc, event can be called next time
 */
// export const leaveNPC = () => {
//   npc.touchEventCalled = false
//   if (npc.showDialog == true) {
//     closeDialog()
//   }
// }

export const closeDialog = () => {
  npc.dialogVisible = false
  reduxDispatch(setInChat(false))
}

/**
 * if the role touches a block, returns its callbackMethod
 * else return false
 * @returns {Boolean}
 */
export const detectBlock = (): any => {
  for (let b of blocks) {
    // do something
    const res = role.touchesBlock(b)
    if (res != TouchBlockName.NONE) {
      // there is collision
      return b.touchEvent.bind(b)
    }
  }
  return false
}

/**
 * boudaray cases
 * 1. bg is on left border
 *  - role moves left until touch left border
 *    role.position.x <= 0, stop
 * 2. bg is on right border
 *  - role moves right until touch right border
 *    role.position.x >= canvas.width, stop
 * 3. bg is in middle
 *  - role moves left
 *    role.position.x <= 100, stop, and move the image
 *    unitil bg.position.x >= 0
 *  - role moves right
 *    role.position.x >= canvas.width - 100, stop, and move the image
 *    until bg.position.x + bg.width <= canvas.width
 */
// 
// 1. 
// role.position.x
const doAnimate = () => {
  requestAnimationFrame(doAnimate)
  const stayStill: IVelocity = { x: 0, y: 0 }
  if (role.state == RoleState.LEFT) { // going left
    if (bg.touchesBorder(TouchBorderName.LEFT) && role.touchesBorder(TouchBorderName.LEFT)) {
      // [x] if you want the role to hault when touch the wall, uncomment the following
      // if (role.state == RoleState.LEFT) role.state = RoleState.LEFT_HAULT
      // else if (role.state == RoleState.RIGHT) role.state = RoleState.RIGHT_HAULT
      role.velocity.x = 0
      // bg.setMovement(stayStill)
    } else if (!bg.touchesBorder(TouchBorderName.LEFT) && role.position.x <= role.mapDetectionDistance.left) {
      role.velocity.x = 0
      bg.setMovement({ x: role.baseVelocity, y: 0 }) // bg move to right
    } else bg.setMovement(stayStill)
  } else if (role.state == RoleState.RIGHT) {
    if (bg.touchesBorder(TouchBorderName.RIGHT) && role.touchesBorder(TouchBorderName.RIGHT)) {
      role.velocity.x = 0
      // bg.setMovement(stayStill)
    } else if (!bg.touchesBorder(TouchBorderName.RIGHT) && role.position.x + role.size.width + role.mapDetectionDistance.right >= canvas.width) {
      role.velocity.x = 0
      bg.setMovement({ x: -1 * role.baseVelocity, y: 0 }) // bg move to left
    } else bg.setMovement(stayStill)
  } else if (role.state == RoleState.UP) {
    if (bg.touchesBorder(TouchBorderName.TOP) && role.touchesBorder(TouchBorderName.TOP)) {
      role.velocity.y = 0
      // bg.setMovement(stayStill)
    } else if (!bg.touchesBorder(TouchBorderName.TOP) && role.position.y <= (canvas.height / 2)) {
      role.velocity.y = 0
      bg.setMovement({ x: 0, y: role.baseVelocity }) // bg move to bottom
    } else bg.setMovement(stayStill)
  } else if (role.state == RoleState.DOWN) {
    if (bg.touchesBorder(TouchBorderName.BOTTOM) && role.touchesBorder(TouchBorderName.BOTTOM)) {
      role.velocity.y = 0
      // bg.setMovement(stayStill)
    } else if (!bg.touchesBorder(TouchBorderName.BOTTOM) && role.position.y + role.size.height + role.mapDetectionDistance.bottom >= canvas.height) {
      role.velocity.y = 0
      bg.setMovement({ x: 0, y: -1 * role.baseVelocity }) // bg move to top
    } else bg.setMovement(stayStill)
  } else {
    bg.setMovement(stayStill)
  }
  // bg.update()
  const collision = checkRoleCollision()
  if (collision) {
    
    collision(role)
  }
  role.update()
}

// export const submitRoleStatus = (status: RoleStatus) => {
//   const socket = MapSocket.getInstance()
//   socket.submitRoleStatus(status)
// }

const checkRoleCollision = () => {
  for (let b of blocks) {
    // do something
    const res = role.touchesBlock(b)
    if (res != TouchBlockName.NONE) {
      // there is collision
      return b.touchEvent.bind(b)
    }
  }
  return false
}

const detectBgBorder = () => {
  // do something
}

export const setRoleMove = () => {
  role.continueMovement()
}

export const drawBgFirst = () => {
  bg.update()
}

export const roleIsBlocked = () => {
  return role.blocked
}

const registerKeyBoardEvent = (role: Role) => {
  // console.log(canvas)
  // const map: any = document.getElementById('mapcontent')
  // map.addEventListener('click', (e: any) => {
  //   console.log('click')
  //   canvas.focus()
  // })
  const inChat = getInChat()
  canvas.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!inChat) {
      switch (e.code) {
        case 'KeyA':
          console.log('left')
          role.setGoLeft()
          break
        case 'KeyS':
          // console.log('down')
          role.setGoDown()
          break
        case 'KeyD':
          // console.log('right')
          role.setGoRight()
          break
        case 'KeyW':
          // console.log('up')
          role.setGoUp()
          break
      }
    }
    switch (e.code) {
      case 'Enter':
        if (npc.dialogVisible == true) {
          const socket = MapSocket.getInstance()
          // TODO enter chatroom
          // toggle redux variable
          if (role.state == RoleState.RIGHT) role.state = RoleState.RIGHT_HAULT
          else if (role.state == RoleState.UP) role.state = RoleState.UP_HAULT
          else if (role.state == RoleState.DOWN) role.state = RoleState.DOWN_HAULT
          else if (role.state == RoleState.LEFT) role.state = RoleState.LEFT_HAULT
          reduxDispatch(setInChat(true))
          // remove enter listener
          removeEnterEvent()
          npc.dialogVisible = false // cancel the pop up
          socket.joinRoom()
          // enterRoom('room1')
        }
        break
    }
    
  })
  
  canvas.addEventListener('keyup', (e: KeyboardEvent) => {
    role.setHault(e.code)
    // if (!npc.dialogVisible) {
    // }
  })
}

const removeEnterEvent = () => {
  // canvas.removeEventListener('keydown', (e: KeyboardEvent) => {
    
  // })
}

const removeKeyBoardEvent = (role: Role) => {
  window.removeEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyA':
        console.log('left')
        role.setGoLeft()
        break
      case 'KeyS':
        console.log('down')
        role.setGoDown()
        break
      case 'KeyD':
        console.log('right')
        role.setGoRight()
        break
      case 'KeyW':
        console.log('up')
        role.setGoUp()
        break
    }
  })
}
