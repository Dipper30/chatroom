import { createImage, setRoleMove, roleIsBlocked } from './index'
import { IBlock, BlockEvent, TouchBorderName, CanvasElement, CanvasSetting, IPosition, ISize, IVelocity } from './types'

export default class BackGround implements CanvasElement {
  image: HTMLImageElement
  frame = 0
  blocks: IBlock[] = []
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
  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  constructor (position: IPosition, size: ISize, canvasSetting: CanvasSetting, imageSrc: CanvasImageSource) {
    this.position.x = position.x
    this.position.y = position.y
    this.size.width = size.width
    this.size.height = size.height
    this.canvas = canvasSetting.canvas
    this.c = canvasSetting.c
    this.image = createImage(imageSrc)
  }

  update () {
    if (this.touchesBorder(TouchBorderName.BOTTOM) && this.velocity.y < 0
      || this.touchesBorder(TouchBorderName.TOP) && this.velocity.y > 0
    ) {
      this.velocity.y = 0
    }
    if (this.touchesBorder(TouchBorderName.LEFT) && this.velocity.x > 0
      || this.touchesBorder(TouchBorderName.RIGHT) && this.velocity.x < 0
    ) {
      this.velocity.x = 0
    }
    // important! tell the role to continue moving
    if (this.velocity.x == 0 && this.velocity.y == 0) setRoleMove()
    if (!roleIsBlocked()) {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
   
    this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)
    // update blocks
    this.updateBlockPostion()
    this.clearBlockImage()
    this.draw()
  }

  draw () {
    this.c.drawImage(this.image, this.position.x, this.position.y, this.size.width, this.size.height)
    this.drawBlocks()
  }

  setMovement (velocity: IVelocity = { x: 0, y: 0 }) {
    this.velocity = velocity
  }

  /**
   * detect if the bg touches the border
   * @param border 
   */
  touchesBorder (border: TouchBorderName = TouchBorderName.ALL): Boolean {
    switch (border) {
      case TouchBorderName.LEFT:
        return this.position.x >= 0
      case TouchBorderName.TOP:
        return this.position.y >= 0
      case TouchBorderName.BOTTOM:
        return this.position.y + this.size.height <= this.canvas.height
      case TouchBorderName.RIGHT:
        return this.position.x + this.size.width <= this.canvas.width
      case TouchBorderName.HORIZONTAL:
        return this.position.x >= 0 || this.position.x + this.size.width <= this.canvas.width
      case TouchBorderName.VERTICAL:
        return this.position.y >= 0 || this.position.y + this.size.height <= this.canvas.height
      case TouchBorderName.ALL:
        return this.position.x >= 0
          && this.position.y >= 0
          && this.position.x + this.size.width <= this.canvas.width
          && this.position.y + this.size.height <= this.canvas.height
      case TouchBorderName.ANY:
      default:
        return this.position.x >= 0
          || this.position.y >= 0
          || this.position.x + this.size.width <= this.canvas.width
          || this.position.y + this.size.height <= this.canvas.height
    }
  }

  /**
   * register Blocks
   */
  register (block: IBlock) {
    this.blocks.push(block)
  }

  updateBlockPostion () {
    this.blocks.forEach((block) => {
      block.updatePosition({ x: this.position.x, y: this.position.y })
    })
  }

  clearBlockImage () {
    this.blocks.forEach((block) => {
      block.clearImage()
    })
  }

  drawBlocks () {
    this.blocks.forEach((block) => {
      block.draw()
    })
  }
}
