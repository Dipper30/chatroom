
import CanvasPlayer from './CanvasPlayer'
import Game from './Game'
import { DressType, IGameElement, RoleState, TouchBorderName, StatusSnapShot } from './types.d'

class MainPlayer extends CanvasPlayer implements IGameElement {
  static instance: MainPlayer | null
  timer: any = null // for debounce
  snapShot: StatusSnapShot = {
    absolutePosition: { absX: 0, absY: 0 },
    velocity: { x: 0, y: 0 },
    state: RoleState.IDLE,
  }
  mapMoveBorder = {
    left: 150,
    right: 150,
    top: 250,
    bottom: 100,
  }

  constructor (uid: number, username: string, dressType: DressType = 'default') {
    super(uid, username, dressType)
    this.registerKeyboardEvent()
  }

  static getInstance (uid: number, username: string, dressType?: DressType) {
    if (!this.instance) {
      this.instance = new MainPlayer(uid, username, dressType)
    }
    return this.instance
  }

  setState (newState: RoleState) {
    this.state = newState
  }

  debounce (fn: (e: KeyboardEvent) => void, interval: number) {
    return (e: KeyboardEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this
      const functionName = fn.name.split(' ')[1]
      if (functionName == 'keyupEvent') {
        console.log('hold')
        fn.call(context, e)
        this.timer = setTimeout(() => {
          this.timer = null
        }, interval)
        return
      }
      // eslint-disable-next-line prefer-rest-params
      if (!this.timer) {
        // 无timer直接执行
        this.timer = setTimeout(() => {
          this.timer = null
        }, interval)
        fn.call(context, e)
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          fn.call(context, e)
        }, interval)
      }
    }
  }

  checkMapMove (): boolean {
    const game = Game.getInstance()
    // const map = game.getMapInfo()
    const world = game.getCurrentWorld()
    const approchingToBorder = this.approchingToBorder()
    // console.log(mapTouchesBorder != TouchBorderName.BOTTOM, approchingToBorder, this.state == RoleState.DOWN)
    if ((approchingToBorder && this.state == RoleState.LEFT && !world.map.touchesBorder(TouchBorderName.LEFT))
    || (approchingToBorder && this.state == RoleState.RIGHT && !world.map.touchesBorder(TouchBorderName.RIGHT))
    || (approchingToBorder && this.state == RoleState.UP && !world.map.touchesBorder(TouchBorderName.TOP))
    || (approchingToBorder && this.state == RoleState.DOWN && !world.map.touchesBorder(TouchBorderName.BOTTOM))
    ) {
      world.map.setVelocity(-1 * this.velocity.x, -1 * this.velocity.y)
      this.setVelocity(0, 0)
      return true
    } else if (this.state == RoleState.LEFT || this.state == RoleState.RIGHT) {
      world.map.velocity.y = 0
    } else if (this.state == RoleState.UP || this.state == RoleState.DOWN) {
      world.map.velocity.x = 0
    }
    return false
  }

  approchingToBorder (): boolean {
    return (this.position.x <= this.mapMoveBorder.left && this.state == RoleState.LEFT)
      || (this.position.x + this.size.width >= this.canvas.width - this.mapMoveBorder.right && this.state == RoleState.RIGHT)
      || (this.position.y <= this.mapMoveBorder.top && this.state == RoleState.UP)
      || (this.position.y + this.size.height >= this.canvas.height - this.mapMoveBorder.bottom && this.state == RoleState.DOWN)
  }

  registerKeyboardEvent () {
    this.keydownEvent = this.keydownEvent.bind(this)
    this.keyupEvent = this.keyupEvent.bind(this)
    this.canvas.addEventListener('keydown', this.keydownEvent)
    this.canvas.addEventListener('keyup', this.keyupEvent)
    // this.canvas.addEventListener('keydown', this.debounce(this.keydownEvent.bind(this), getTickInterval()))
    // this.canvas.addEventListener('keyup', this.debounce(this.keyupEvent.bind(this), getTickInterval()))
  }

  removeKeyboardEvent () {
    this.canvas.removeEventListener('keydown', this.keydownEvent)
    this.canvas.removeEventListener('keyup', this.keyupEvent)
  }

  keydownEvent (e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyA':
        // console.log('left')
        // this.setGoLeft()
        this.setNewState(RoleState.LEFT)
        break
      case 'KeyS':
        // console.log('down')
        // this.setGoDown()
        this.setNewState(RoleState.DOWN)
        break
      case 'KeyD':
        // console.log('right')
        // this.setGoRight()
        this.setNewState(RoleState.RIGHT)
        break
      case 'KeyW':
        // console.log('up')
        // this.setGoUp()
        this.setNewState(RoleState.UP)
        break
    }
     // switch (e.code) {
      //   case 'Enter':
      //     if (npc.dialogVisible == true) {
      //       const socket = MapSocket.getInstance()
      //       // TODO enter chatroom
      //       // toggle redux variable
      //       if (role.state == RoleState.RIGHT) role.state = RoleState.RIGHT_HAULT
      //       else if (role.state == RoleState.UP) role.state = RoleState.UP_HAULT
      //       else if (role.state == RoleState.DOWN) role.state = RoleState.DOWN_HAULT
      //       else if (role.state == RoleState.LEFT) role.state = RoleState.LEFT_HAULT
      //       reduxDispatch(setInChat(true))
      //       // remove enter listener
      //       removeEnterEvent()
      //       npc.dialogVisible = false // cancel the pop up
      //       socket.joinRoom()
      //       // enterRoom('room1')
      //     }
      //     break
      // }
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
    // if (this.state != newState) this.submitMyStatus(newState)
  }

  keyupEvent (e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyA':
        this.setNewState(RoleState.LEFT_HAULT)
        break
      case 'KeyS':
        this.setNewState(RoleState.DOWN_HAULT)
        break
      case 'KeyD':
        this.setNewState(RoleState.RIGHT_HAULT)
        break
      case 'KeyW':
        this.setNewState(RoleState.UP_HAULT)
        break
    }
  }

  // touchesBorder (borderName: TouchBorderName): boolean {
  //   switch (borderName) {
  //     case TouchBorderName.LEFT:
  //       return this.position.x <= 0
  //     case TouchBorderName.RIGHT:
  //       return this.position.y <= 0
  //     case TouchBorderName.TOP:
  //       return this.position.x + this.size.width >= this.canvas.width
  //     case TouchBorderName.BOTTOM:
  //       return this.position.y + this.size.height >= this.canvas.height
  //     case TouchBorderName.ANY:
  //       return (
  //         this.position.x <= 0
  //         || this.position.y <= 0
  //         || this.position.x + this.size.width >= this.canvas.width
  //         || this.position.y + this.size.height >= this.canvas.height
  //       )
  //     case TouchBorderName.NONE:
  //     default:
  //       return !(
  //         this.position.x <= 0
  //         || this.position.y <= 0
  //         || this.position.x + this.size.width >= this.canvas.width
  //         || this.position.y + this.size.height >= this.canvas.height
  //       )

  //   }
  // }

  update () {
    if (this.state == RoleState.DOWN) this.setVelocity(0, this.baseVelocity)
    else if (this.state == RoleState.UP) this.setVelocity(0, -1 * this.baseVelocity)
    else if (this.state == RoleState.LEFT) this.setVelocity(-1 * this.baseVelocity, 0)
    else if (this.state == RoleState.RIGHT) this.setVelocity(this.baseVelocity, 0)
    else this.setVelocity(0, 0)

    if (this.isMoving()) {
      // check if collide with anyone
      if (this.detectCollision()) {
        this.setVelocity(0, 0)
      }
      else {
        // check if move map
        if (this.checkMapMove()) {
          this.setVelocity(0, 0)
        }
        // check if touches border
        this.updateVelocityIfTouchesBorder.call(this)
      }
      this.detectEvent()
    }
    
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    const game = Game.getInstance()
    const world = game.getCurrentWorld()
    if (this.snapShot.velocity.x != Math.min(this.velocity.x - world.map.velocity.x, this.baseVelocity)
      || this.snapShot.velocity.y != Math.min(this.velocity.y - world.map.velocity.y, this.baseVelocity)
      || this.snapShot.state != this.state
    ) {
        //
        const game = Game.getInstance()
        const map = game.world.map
        this.snapShot = {
          absolutePosition: {
            absX: this.position.x - map.position.x,
            absY: this.position.y - map.position.y,
          },
          velocity: {
            x: this.velocity.x - world.map.velocity.x,
            y: this.velocity.y - world.map.velocity.y,
          },
          state: this.state,
        }
        this.submitMyStatus(this.snapShot)
      }
  }

}

export default MainPlayer