import { createImage } from "../canvas";
import Role from "../canvas/Role";
import { RoleStatus } from "../canvas/types";
import { roleSprites } from "./config/images";
import Game from "./Game";
import GameMap from "./GameMap";
import GameSocket from "./socket/GameSocket";
import { ACanvasPlayer, IGameElement, PlayerSprite, Position, RoleState, Size, SpriteMode, Velocity, TouchBorderName, Collidable, AbsolutePosition, DressType } from "./types.d";

export default class CanvasPlayer extends ACanvasPlayer implements IGameElement, Collidable {
  canvas: HTMLCanvasElement | any = document.getElementById('game')
  c: CanvasRenderingContext2D = this.canvas.getContext('2d')
  uid: number
  username: string
  position: Position
  collisionRadius: number
  absolutePosition: AbsolutePosition
  size: Size
  image: PlayerSprite
  frame: number
  blinkDelay: number = 30
  haultRandom: number = Math.random() * 16
  baseVelocity: number = 5
  spriteConfig: {
    standDown: SpriteMode,
    standLeft: SpriteMode,
    standRight: SpriteMode,
    standUp: SpriteMode,
    right: SpriteMode,
    left: SpriteMode,
    down: SpriteMode,
    up: SpriteMode,
  }
  velocity: Velocity

  constructor (uid: number, username: string, dressType: DressType = 'default',
    position: Position = { x: 200, y: 300 },
    size: Size = { width: 50, height: 50 },
    velocity = { x: 0, y: 0 },
    frame: number = 0,
    state: RoleState = RoleState.DOWN_HAULT,
    collisionRadius: number = 20,
    ) {
    super()
    this.uid = uid
    this.username = username
    this.position = position
    this.absolutePosition = { absX: this.position.x, absY: this.position.y }
    this.size = size
    this.velocity = velocity
    const spriteConfig = roleSprites[dressType]
    this.image = {
      img: createImage(spriteConfig.imgSrc),
    }
    this.spriteConfig = spriteConfig
    this.frame = frame
    this.state = state
    this.collisionRadius = collisionRadius
  }

  setState (newState: RoleState): void {
    this.state = newState
  }

  getSpriteMode (): SpriteMode {
    const s = this.state
    const { standDown, standLeft, standRight, standUp, right, left, down, up } = this.spriteConfig
    let spriteMode = down
    if (s == RoleState.LEFT) spriteMode = left
    if (s == RoleState.RIGHT) spriteMode = right
    if (s == RoleState.UP) spriteMode = up
    if (s == RoleState.DOWN) spriteMode = down
    if (s == RoleState.RIGHT_HAULT) spriteMode = standRight
    if (s == RoleState.LEFT_HAULT) spriteMode = standLeft
    if (s == RoleState.UP_HAULT) spriteMode = standUp
    if (s == RoleState.DOWN_HAULT) spriteMode = standDown
    return spriteMode
  }

  nextFrame () {
    this.frame++
  }

  clearPrevImage () {    
    this.c.clearRect(this.position.x - 5, this.position.y - 5, this.size.width + 10, this.size.height + 10)
  }

  /**
   * draw image with a computed start postion
   * @param startX 
   * @param startY 
   */
   drawWithContext (frame: number) {
    const spriteMode = this.getSpriteMode()
    this.c.drawImage(
      this.image.img,
      spriteMode.startPosition.x + spriteMode.cropWidth * frame,
      spriteMode.startPosition.y,
      spriteMode.width,
      spriteMode.height,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
    )
  }

  /**
   * get frame of blink animation
   * @returns {number} frame for hault
   */
   getBlinkFrame (): number {
    let frame = 0
    if (this.frame > this.blinkDelay + this.haultRandom && this.frame < this.blinkDelay + 3 + this.haultRandom) frame = 1
    if (this.frame >= this.blinkDelay + 3 + this.haultRandom && this.frame < this.blinkDelay + 7 + this.haultRandom) frame = 2
    if (this.frame >= this.blinkDelay + 11 + this.haultRandom) {
      this.frame = 0
      this.haultRandom = Math.random() * 10
    }
    return frame
  }

  /**
   * draw motions according to next state
   * @param motion 
   */
  determineCurrentAnimation () {
    let frame = 0
    this.nextFrame()
    const motion = this.state
    const { standDown, standLeft, standRight, standUp, right, left, down, up } = this.spriteConfig
    switch (motion) {
      case RoleState.RIGHT:
      case RoleState.LEFT:
      case RoleState.DOWN:
      case RoleState.UP:
        if (this.frame > 9) this.frame = 0
        frame = Math.floor(this.frame)
        this.drawWithContext(frame)
        break
      case RoleState.UP_HAULT:
        this.frame = 0
        this.drawWithContext(0)
        break
      case RoleState.HAULT:
      case RoleState.DOWN_HAULT: 
      case RoleState.LEFT_HAULT:
      case RoleState.RIGHT_HAULT:
        frame = this.getBlinkFrame()
        this.drawWithContext(frame)
        break
    }
  }

  draw () {
    const w = this.c.measureText(this.username).width
    this.c.strokeStyle = '#23ade5'
    this.c.font = '12px Monaco'
    this.c.strokeText(this.username, this.position.x - 10 + (this.size.width + 20 - w) / 2, this.position.y, this.size.width + 20)
    this.determineCurrentAnimation()
  }

  submitMyStatus (snapShot: any) {
    //
    const game = Game.getInstance()
    game.submitStatus(snapShot)
    // console.log(snapShot)
    
  }

  setNewState (newState: RoleState) {
    // set state
    if (newState == RoleState.LEFT_HAULT
      || newState == RoleState.RIGHT_HAULT
      || newState == RoleState.UP_HAULT
      || newState == RoleState.DOWN_HAULT
    ) {
      if (newState == RoleState.LEFT_HAULT && this.state == RoleState.LEFT) this.state = RoleState.LEFT_HAULT
      else if (newState == RoleState.RIGHT_HAULT && this.state == RoleState.RIGHT) this.state = RoleState.RIGHT_HAULT
      else if (newState == RoleState.UP_HAULT && this.state == RoleState.UP) this.state = RoleState.UP_HAULT
      else if (newState == RoleState.DOWN_HAULT && this.state == RoleState.DOWN) this.state = RoleState.DOWN_HAULT
    } else this.state = newState
  }

  // setGoLeft () {
  //   if (this.state != RoleState.LEFT) {
  //     this.state = RoleState.LEFT
  //     this.velocity.y = 0
  //     this.velocity.x = -1 * this.baseVelocity
  //     this.submitMyStatus()
  //   } else this.submitMyStatus()
  // }
  
  // setGoDown () {
  //   if (this.state != RoleState.DOWN) {
  //     this.state = RoleState.DOWN
  //     this.velocity.y = this.baseVelocity
  //     this.velocity.x = 0
  //     this.submitMyStatus()
  //   } else this.submitMyStatus()
  // }
  
  // setGoUp () {
  //   if (this.state != RoleState.UP) {
  //     this.state = RoleState.UP
  //     this.velocity.y = -1 * this.baseVelocity
  //     this.velocity.x = 0
  //     this.submitMyStatus()
  //   } else this.submitMyStatus()
  // }
  
  // setGoRight () {
  //   if (this.state != RoleState.RIGHT) {
  //     this.state = RoleState.RIGHT
  //     this.velocity.y = 0
  //     this.velocity.x = this.baseVelocity
  //     this.submitMyStatus()
  //   } else this.submitMyStatus()
  // }

  // setHault (code: string) {
  //   if ( (this.state == RoleState.LEFT && code == 'KeyA')
  //     || (this.state == RoleState.RIGHT && code == 'KeyD')
  //     || (this.state == RoleState.UP && code == 'KeyW')
  //     || (this.state == RoleState.DOWN && code == 'KeyS')
  //   ) {
  //     // determine animation
  //     if (this.state == RoleState.DOWN) this.state = RoleState.DOWN_HAULT
  //     else if (this.state == RoleState.UP) this.state = RoleState.UP_HAULT
  //     else if (this.state == RoleState.LEFT) this.state = RoleState.LEFT_HAULT
  //     else if (this.state == RoleState.RIGHT) this.state = RoleState.RIGHT_HAULT
  //     // if (vertical) this.velocity.y = 0
  //     // if (horizontal) this.velocity.x = 0
  //     // TODO
  //     this.velocity = {
  //       x: 0, y: 0,
  //     }
  //     this.submitMyStatus()
  //   } else this.submitMyStatus()
  // }

  touchesBorder (borderName: TouchBorderName): boolean {
    switch (borderName) {
      case TouchBorderName.LEFT:
        return this.position.x <= 0
      case TouchBorderName.RIGHT:
        return this.position.x + this.size.width >= this.canvas.width
      case TouchBorderName.TOP:
        return this.position.y <= 0
      case TouchBorderName.BOTTOM:
        return this.position.y + this.size.height >= this.canvas.height
      default:
        return false
    }
  }

  computeCenterPosition (): Position {
    return {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2,
    }
  }

  detectEvent () {
    const game = Game.getInstance()
    const world = game.getCurrentWorld()
    return world.detectEvent(this)
  }

  detectCollision () {
    const game = Game.getInstance()
    const world = game.getCurrentWorld()
    return world.detectCollision(this)
    // for (let block of world.blocks) {
    //   if (block.detectCollision(centerPosition)) return true
    // }
    // return false
  }

  setVelocity (x: number = 0, y: number = 0) {
    this.velocity = { x, y }
  }

  updateVelocityIfTouchesBorder () {
    if (this.state == RoleState.LEFT && this.touchesBorder(TouchBorderName.LEFT)) this.velocity.x = 0
    if (this.state == RoleState.RIGHT && this.touchesBorder(TouchBorderName.RIGHT)) this.velocity.x = 0
    if (this.state == RoleState.UP && this.touchesBorder(TouchBorderName.TOP)) this.velocity.y = 0
    if (this.state == RoleState.DOWN && this.touchesBorder(TouchBorderName.BOTTOM)) this.velocity.y = 0
  }

  isMoving (): boolean {
    return this.state == RoleState.LEFT
      || this.state == RoleState.RIGHT
      || this.state == RoleState.UP
      || this.state == RoleState.DOWN
  }

  update () {
    //
    if ((this.velocity.x != 0 || this.velocity.y != 0) && this.detectCollision()) this.setVelocity(0, 0)
    else {
      if (this.state == RoleState.DOWN) this.setVelocity(0, this.baseVelocity)
      else if (this.state == RoleState.UP) this.setVelocity(0, -1 * this.baseVelocity)
      else if (this.state == RoleState.LEFT) this.setVelocity(-1 * this.baseVelocity, 0)
      else if (this.state == RoleState.RIGHT) this.setVelocity(this.baseVelocity, 0)
      else this.setVelocity(0, 0)
    }
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

}