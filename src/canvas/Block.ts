import BackGround from './Background'
import { createImage, pureUpdate, setRoleMove } from './index'
import { IBlock, TouchBorderName, CanvasElement, CanvasSetting, IPosition, ISize, IVelocity, ITouchRaius, IRole } from './types'
import { getRandomId } from './utils'

export class NPC implements IBlock {
  id: string
  offsetX: number = 0
  offsetY: number = 0
  touchRaius: ITouchRaius = {
    x: 0,
    y: 0,
  }
  position: IPosition = {
    x: 0,
    y: 0,
  }
  size: ISize = {
    width: 0,
    height: 0,
  }
  velocity = {
    x: 0,
    y: 0,
  }

  dialogVisible: boolean = false // show dialog pop up
  touchEventCalled: boolean = false

  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  image: HTMLImageElement

  constructor (position: IPosition,
    size: ISize,
    canvasSetting: CanvasSetting,
    imageSrc: CanvasImageSource,
    touchRaius: ITouchRaius = { x: 0, y: 0 })
  {
    this.offsetX = position.x
    this.offsetY = position.y
    this.size.width = size.width
    this.size.height = size.height
    this.canvas = canvasSetting.canvas
    this.c = canvasSetting.c
    this.image = createImage(imageSrc)
    this.id = '' + getRandomId()
    this.touchRaius = touchRaius
  }

  callback (backgroundPosition: IPosition) {
    this.position.x = backgroundPosition.x + this.offsetX
    this.position.y = backgroundPosition.y + this.offsetY
    this.update()
  }

  updatePosition (backgroundPosition: IPosition) {
    this.position.x = backgroundPosition.x + this.offsetX
    this.position.y = backgroundPosition.y + this.offsetY
  }

  clearImage () {
    this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }

  update () {
    // update
    // this.position.x = this.offsetXw
    // this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)
    this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)

    this.draw()
  }

  showDialog () {
    this.dialogVisible = true
    this.c.strokeStyle = '#aaa'
    this.c.font = '14px Monaco'
    this.c.strokeText('Let\'s Chat!', this.position.x - 30, this.position.y - 50)
  }

  closeDialog () {
    this.dialogVisible = false
  }

  draw () {
    // draw
    this.c.fillStyle = 'rgba(100%,25%,100%,0)'
    this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    this.c.strokeStyle = '#222'
    this.c.font = '12px Monaco'
    this.c.strokeText('Maid', this.position.x + 7, this.position.y - 5)
    // this.c.fillStyle = 'red'
    // this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)

    if (this.dialogVisible) {
      this.c.fillStyle = '#222'
      this.c.fillRect(this.position.x - 60, this.position.y - 60, 230, 40)
      this.c.strokeStyle = '#aaa'
      this.c.font = '14px Monaco'
      this.c.strokeText('Let\'s Chat! (Press Enter)', this.position.x - 45, this.position.y - 35)
    }
    // this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    // this.c.drawImage(this.image, 24 * 10, 32 * 5, 24, 32, this.position.x, this.position.y, this.size.width, this.size.height)
  }

  /**
   * register the block to background map
   */
  register () {
    // do something
  }

  touchEvent (body: IRole) {
    // someone touches you
    console.log('I am touched by', body)
    this.touchEventCalled = true
  }
}
