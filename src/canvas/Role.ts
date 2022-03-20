import MapSocket from '../service/Socket'
import { closeDialog, createImage, detectBlock, drawBgFirst, getBgPosition } from './index'
import { TouchBorderName, CanvasElement, CanvasSetting, IRole, RoleState, TouchBlockName, IBlock, RoleStatus } from './types'

export default class Role implements CanvasElement {
  socket: any
  image: HTMLImageElement
  username: string = ''
  socketId: string = ''
  userId: number = 0
  user: any = null
  frame = 0
  state = RoleState.HAULT
  blinkDelay = 180 // time interval between eye-blinks
  haultRandom = Math.random() * 160
  c: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  baseVelocity = 2
  blocked: boolean = false
  mapSocket: any
  offsetX: number = 0
  offsetY: number = 0

  velocity = {
    x: 0,
    y: 0,
  }
  position = {
    x: 0,
    y: 0,
  }
  status: RoleStatus = {
    state: this.state,
    velocity: this.velocity,
    offsetX: this.position.x,
    offsetY: this.position.y,
    frame: this.frame,
  }
  events: any = {
    meetNPC: false,
  }
  mapDetectionDistance = {
    left: 250,
    right: 250,
    top: 250,
    bottom: 150,
  }
  sprites = {
    standDown: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 0,
      },
    },
    standUp: {
      cropWidth: 120,
      width: 120,
      height: 150,
      startPosition: {
        x: 0,
        y: 2 * 130,
      },
    },
    standLeft: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 1 * 130,
      },
    },
    standRight: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 3 * 130,
      },
    },
    right: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 7 * 130,
      },
    },
    left: {
      cropWidth: 120,
      width: 120,
      height: 130,
      startPosition: {
        x: 0,
        y: 5 * 130,
      },
    },
    down: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 4 * 130,
      },
    },
    up: {
      cropWidth: 120,
      width: 120,
      height: 130,
      startPosition: {
        x: 0,
        y: 6 * 130,
      },
    },
  }
  size = {
    width: 0,
    height: 0,
  }

  constructor (v: IRole, canvas: CanvasSetting, imageSrc: CanvasImageSource, userId: number, username: string, socketId: string) {
    this.position = v.position
    this.size = v.size
    this.c = canvas.c
    this.canvas = canvas.canvas
    this.image = createImage(imageSrc)
    this.username = username
    this.userId = userId
    this.socketId = socketId
  }

  draw () {
    this.c.clearRect(this.position.x - 5, this.position.y - 5, this.size.width + 10, this.size.height + 10)
    drawBgFirst()
    this.blocked = false
    this.drawCurrentAnimation(this.state)
  }

  update () {
    // this.c.fillStyle = 'rgba(225,225,225,1)';
    // this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    // this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)
    const collisionEvent = detectBlock()
    if (collisionEvent) {
      collisionEvent(this)
      this.blocked = true
    } else {
      this.events.meetNPC = false
      closeDialog()
    }
    // this.events.meetNPC = false
    // leaveNPC()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.frame++
    this.draw()
  }
  
  setGoLeft () {
    if (this.state != RoleState.LEFT) {
      this.state = RoleState.LEFT
      this.velocity.y = 0
      this.velocity.x = -1 * this.baseVelocity
      this.submitMyStatus()
    } else this.submitMyStatus()
  }
  
  setGoDown () {
    if (this.state != RoleState.DOWN) {
      this.state = RoleState.DOWN
      this.velocity.y = this.baseVelocity
      this.velocity.x = 0
      this.submitMyStatus()
    } else this.submitMyStatus()
  }
  
  setGoUp () {
    if (this.state != RoleState.UP) {
      this.state = RoleState.UP
      this.velocity.y = -1 * this.baseVelocity
      this.velocity.x = 0
      this.submitMyStatus()
    } else this.submitMyStatus()
  }
  
  setGoRight () {
    if (this.state != RoleState.RIGHT) {
      this.state = RoleState.RIGHT
      this.velocity.y = 0
      this.velocity.x = this.baseVelocity
      this.submitMyStatus()
    } else this.submitMyStatus()
  }
  
  setHault (code: string, horizontal: boolean = true, vertical: boolean = true) {
    if ( (this.state == RoleState.LEFT && code == 'KeyA')
      || (this.state == RoleState.RIGHT && code == 'KeyD')
      || (this.state == RoleState.UP && code == 'KeyW')
      || (this.state == RoleState.DOWN && code == 'KeyS')
    ) {
      // determine animation
      if (this.state == RoleState.DOWN) this.state = RoleState.DOWN_HAULT
      else if (this.state == RoleState.UP) this.state = RoleState.UP_HAULT
      else if (this.state == RoleState.LEFT) this.state = RoleState.LEFT_HAULT
      else if (this.state == RoleState.RIGHT) this.state = RoleState.RIGHT_HAULT
      if (vertical) this.velocity.y = 0
      if (horizontal) this.velocity.x = 0
      this.submitMyStatus()
    } else this.submitMyStatus()
  }

  /**
   * draw image with a computed start postion
   * @param startX 
   * @param startY 
   */
  drawWithContext (spriteMode: any, frame: number) {
    // this.c.globalAlpha = 0.5
    const w = this.c.measureText(this.username).width
    this.c.strokeStyle = '#23ade5'
    this.c.font = '12px Monaco'
    this.c.strokeText(this.username, this.position.x - 10 + (this.size.width + 20 - w) / 2, this.position.y, this.size.width + 20)
    // this.c.textAlign = 'center'
    // before drawing self image, submit status to server and draw other players
    
    // console.log(this.sosdcket)
    this.mapSocket.renderAll(this.socket.id)
    // this.renderSelfByFrame()
    // this.socket.renderAll(this)
    this.c.drawImage(
      this.image,
      spriteMode.startPosition.x + spriteMode.cropWidth * frame,
      spriteMode.startPosition.y,
      spriteMode.width,
      spriteMode.height,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
    )
    // this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }

  //socketId: string, frame: any
  renderSelfByFrame (role: Role) {
    const { standDown, standLeft, standRight, standUp, right, left, down, up } = role.sprites
    const frameInfo = role.status
    let spriteMode = left
    // // console.log('render me!!!!!!!', frame)
    // // console.log(frame?.status?.state)
    // let spriteMode: any = null
    const s = frameInfo.state
    if (s == RoleState.LEFT) spriteMode = left
    if (s == RoleState.RIGHT) spriteMode = right
    if (s == RoleState.UP) spriteMode = up
    if (s == RoleState.DOWN) spriteMode = down
    if (s == RoleState.RIGHT_HAULT) spriteMode = standRight
    if (s == RoleState.LEFT_HAULT) spriteMode = standLeft
    if (s == RoleState.UP_HAULT) spriteMode = standUp
    if (s == RoleState.DOWN_HAULT) spriteMode = standDown
    
    const bgPosition = getBgPosition()

    this.c.fillStyle = 'red'
    // console.log(frameInfo.offsetX, role.offsetX)
    
    const x = bgPosition.x + frameInfo.offsetX + frameInfo.velocity.x
    const y = bgPosition.y + frameInfo.offsetY + frameInfo.velocity.y
    frameInfo.offsetX = frameInfo.offsetX + frameInfo.velocity.x
    frameInfo.offsetY = frameInfo.offsetY + frameInfo.velocity.y

    // this.c.fillRect(x, y, 100, 100)
    // this.drawCurrentAnimation(RoleState.RIGHT)
    let frame = this.computeOtherRoleFrame(role)
    role.frame++
    const w = this.c.measureText(role.username).width
    this.c.strokeStyle = '#23ade5'
    this.c.font = '12px Monaco'
    this.c.strokeText(role.username, x - 10 + (role.size.width + 20 - w) / 2, y, role.size.width + 20)
    // console.log(frameInfo.offsetX, frameInfo.velocity.x, frameInfo.state)
    this.c.drawImage(
      role.image,
      spriteMode.startPosition.x + spriteMode.cropWidth * frame,
      spriteMode.startPosition.y,
      spriteMode.width,
      spriteMode.height,
      x,
      y,
      role.size.width,
      role.size.height,
    )
  }

  computeOtherRoleFrame (role: Role) {
    let currentFrame = role.frame
    let frame = 0
    // console.log('now@@@@@@@', currentFrame, role.status.state == RoleState.DOWN_HAULT, role.blinkDelay, role.haultRandom)
    switch (role.status.state) {
      case RoleState.RIGHT:
      case RoleState.LEFT:
      case RoleState.DOWN:
      case RoleState.UP:
        if (role.frame > 59) role.frame = 0
        return Math.floor(role.frame / 6)
      case RoleState.UP_HAULT:
        return 0
      case RoleState.HAULT:
      case RoleState.LEFT_HAULT:
      case RoleState.RIGHT_HAULT:
      case RoleState.DOWN_HAULT: 
        if (role.frame > role.blinkDelay + role.haultRandom && role.frame < role.blinkDelay + 10 + role.haultRandom) frame = 1
        if (role.frame >= role.blinkDelay + 10 + role.haultRandom && role.frame < role.blinkDelay + 22 + role.haultRandom) frame = 2
        if (role.frame >= role.blinkDelay + 22 + role.haultRandom) {
          role.frame = 0
          role.haultRandom = Math.random() * 160
        }
        return frame
      default:
        return 0
    } 
  }

  submitMyStatus () {
    // if (this.compareStatus()) {
      // changed
      const bgPosition = getBgPosition()
      this.status = {
        state: this.state,
        velocity: this.velocity,
        offsetX: this.position.x - bgPosition.x, // absolute distance in the map
        offsetY: this.position.y - bgPosition.y,
        frame: this.frame,
      }
      // submit status to server
      this.mapSocket?.submitRoleStatus(this.status)
      // submitRoleStatus(this.status)
    // }
  }

  /**
   * compare current status with previous status
   * @returns true if current status has changed
   */
  compareStatus (): Boolean {
    return (this.status.velocity.x != this.velocity.x
      || this.status.velocity.y != this.velocity.y
      || this.status.state != this.state
    )
  }

  collide () {
    this.submitMyStatus()
  }

  /**
   * get frame of blink animation
   * @returns {number} frame for hault
   */
  getBlinkFrame (): number {
    let frame = 0
    if (this.frame > this.blinkDelay + this.haultRandom && this.frame < this.blinkDelay + 10 + this.haultRandom) frame = 1
    if (this.frame >= this.blinkDelay + 10 + this.haultRandom && this.frame < this.blinkDelay + 22 + this.haultRandom) frame = 2
    if (this.frame >= this.blinkDelay + 22 + this.haultRandom) {
      this.frame = 0
      this.haultRandom = Math.random() * 160
    }
    return frame
  }

  continueMovement () {
    switch (this.state) {
      case RoleState.LEFT:
        if (!this.touchesBorder(TouchBorderName.LEFT)) this.velocity.x = -1 * this.baseVelocity
        break
      case RoleState.RIGHT:
        if (!this.touchesBorder(TouchBorderName.RIGHT)) this.velocity.x = this.baseVelocity
        break
      case RoleState.UP:
        if (!this.touchesBorder(TouchBorderName.TOP)) this.velocity.y = -1 * this.baseVelocity
        break
      case RoleState.DOWN:
        if (!this.touchesBorder(TouchBorderName.BOTTOM)) this.velocity.y = this.baseVelocity
        break
      default:
        this.velocity.x = 0
        this.velocity.y = 0
    }
  }


  /**
   * detect if the bg touches the border
   * @param border 
   */
  touchesBorder (border: TouchBorderName = TouchBorderName.ALL): Boolean {
    switch (border) {
      case TouchBorderName.LEFT:
        return this.position.x <= 0
      case TouchBorderName.TOP:
        return this.position.y <= 0
      case TouchBorderName.BOTTOM:
        return this.position.y + this.size.height >= this.canvas.height
      case TouchBorderName.RIGHT:
        return this.position.x + this.size.width >= this.canvas.width
      case TouchBorderName.HORIZONTAL:
        return this.position.x <= 0 || this.position.x + this.size.width >= this.canvas.width
      case TouchBorderName.VERTICAL:
        return this.position.y <= 0 || this.position.y + this.size.height >= this.canvas.height
      case TouchBorderName.ALL:
        return this.position.x <= 0
          && this.position.y <= 0
          && this.position.y + this.size.height >= this.canvas.height
          && this.position.x + this.size.width >= this.canvas.width
      case TouchBorderName.ANY:
      default:
        return this.position.x <= 0
          || this.position.y <= 0
          || this.position.y + this.size.height >= this.canvas.height
          || this.position.x + this.size.width >= this.canvas.width
    }
  }

  touchesBlock (block: IBlock): TouchBlockName {
    if (block.touchEventCalled == false
      && this.position.x <= block.position.x + block.size.width + block.touchRaius.x
      && this.position.x + this.size.width >= block.position.x - block.touchRaius.x
      && this.position.y <= block.position.y + block.size.height + block.touchRaius.y
      && this.position.y + this.size.height >= block.position.y - block.touchRaius.y
    ) {
      // collision!!
      return TouchBlockName.ANY
    } else return TouchBlockName.NONE
  }

  /**
   * draw motions according to next state
   * @param motion 
   */
  drawCurrentAnimation (motion: RoleState) {
    let frame = 0
    const { standDown, standLeft, standRight, standUp, right, left, down, up } = this.sprites
    switch (motion) {
      case RoleState.HAULT:
      case RoleState.DOWN_HAULT: 
        frame = this.getBlinkFrame()
        this.drawWithContext(standDown, frame)
        break
      case RoleState.RIGHT:
        if (this.frame > 59) this.frame = 0
        frame = Math.floor(this.frame / 6)
        this.drawWithContext(right, frame)
        break
      case RoleState.LEFT:
        if (this.frame > 59) this.frame = 0
        frame = Math.floor(this.frame / 6)
        this.drawWithContext(left, frame)
        break
      case RoleState.DOWN:
        if (this.frame > 59) this.frame = 0
        frame = Math.floor(this.frame / 6)
        this.drawWithContext(down, frame)
        break
      case RoleState.UP:
        if (this.frame > 59) this.frame = 0
        frame = Math.floor(this.frame / 6)
        this.drawWithContext(up, frame)
        break
      case RoleState.UP_HAULT:
        this.drawWithContext(standUp, 0)
        this.frame = 0
        break
      case RoleState.LEFT_HAULT:
        frame = this.getBlinkFrame()
        this.drawWithContext(standLeft, frame)
        break
      case RoleState.RIGHT_HAULT:
        frame = this.getBlinkFrame()
        this.drawWithContext(standRight, frame)
        break
    }
  }

}
