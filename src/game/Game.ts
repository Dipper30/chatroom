import { getTickInterval, reduxDispatch } from '../service/utils'
import { setInChat } from '../store/actions/map'
import GameSocket from './socket/GameSocket'
import { FrameInfo, NameSpace, RoleState } from './types.d'
import World from './World'

/**
 * Controller Layer
 */
export default class Game {
  canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
  c: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
  static instance: Game | null

  #gameSocket: GameSocket | undefined

  world: any
  timer: any
  stop: boolean = false
  tickInterval: number

  constructor () {
    console.log('new instance')
    this.world = new World('map1')
    this.tickInterval = getTickInterval()
  }

  getCurrentWorld (): World {
    return this.world
  }

  static getInstance (): Game {
    if (!this.instance) {
      this.instance = new Game()
    }
    return this.instance
  }

  static clearInstance () {
    this.instance = null
  }

  resizeCanvas (width: number = 700, height: number = 500) {
    this.canvas.width = width
    this.canvas.height = height
  }

  clearCanvas () {
    this.c.fillStyle = 'white'
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  setSocket (socket: any) {
    this.#gameSocket = socket
  }

  emitFrameInfo (frameInfo: Map<number, FrameInfo>) {
    const world = this.getCurrentWorld()
    world.updateFrameInfo(frameInfo)
  }

  /**
   * 1. show loading
   * 2. connect to server socket
   * 3. initialize elements in game
   * 4. start rendering
   * @param namespace 
   */
  async initGame (namespace: NameSpace) {
    console.log('init game')
    this.world = new World(namespace)
    // 1. show loading
    this.c.fillStyle = 'white'
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.c.fillStyle = '#333'
    this.c.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2)

    // 2. connect to server socket
    const gameSocket = GameSocket.getInstance()
    gameSocket.initSocket(namespace)
    // no render is called until socket notifies it is good to start
    // meanwhile timer keeps running
    this.stop = true

    // 3. initialize elements in game
    this.world.name = namespace

    // 4. start rendering
    this.startGame()
    this.canvas.focus()
  }

  getMapInfo () {
    return this.world.map
  }

  allowStart () {
    this.stop = false
    console.log('allow render')
  }

  enterChatroom (roomId: string) {
    let state = this.world.mainPlayer.state
    if (state == RoleState.RIGHT) state = RoleState.RIGHT_HAULT
    else if (state == RoleState.UP) state = RoleState.UP_HAULT
    else if (state == RoleState.DOWN) state = RoleState.DOWN_HAULT
    else if (state == RoleState.LEFT) state = RoleState.LEFT_HAULT
    reduxDispatch(setInChat(true))
    this.world.mainPlayer.removeKeyboardEvent()
    const gameSocket = GameSocket.getInstance()
    gameSocket.enterRoom(roomId)
  }

  startGame () {
    this.timer = setTimeout(() => {
      if (this.stop != true) {
        this.world.render()
      }
      clearTimeout(this.timer)
      this.timer = null 
      this.startGame()
    }, this.tickInterval)
  }

  endGame () {
    const gameSocket = GameSocket.getInstance()
    gameSocket.closeSocket()
    this.c.clearRect(0, 0, 700, 500)
    clearTimeout(this.timer)
    this.timer = null
    this.world = null
    console.log('close game')
  }

  submitStatus (status: any) {
    const gameSocket = GameSocket.getInstance()
    // gameSocket.closeSocket()
    gameSocket.submitStatus(status)
  }

}