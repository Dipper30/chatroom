import { CanvasImage, IGameElement, NameSpace, Position, Size, TouchBorderName, Velocity } from './types.d';
import { createImage } from './utils'
import { maps } from './config/images'

class GameMap implements IGameElement {
  canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
  c: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
  image: CanvasImage
  frame: number = 0
  velocity: Velocity = { x: 0, y: 0 }
  #width: number = 0
  #height: number = 0
  position: Position = {
    x: 0,
    y: 0,
  }
  size: Size = {
    width: 0,
    height: 0,
  }

  constructor (namespace: NameSpace) {
    const imageConfig = maps[namespace]
    this.image = {
      img: createImage(imageConfig.imgSrc),
      size: { width: imageConfig.width, height: imageConfig.height },
    }
    this.size = {
      width: imageConfig.width,
      height: imageConfig.height,
    }
  }

  get width (): number {
    return this.#width
  }

  get height (): number {
    return this.#height
  }

  nextFrame () {
    this.frame++ 
  }

  clearPrevImage () {
    this.c.clearRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }

  draw (): void {
    this.nextFrame()
    const { img, size } = this.image
    this.c.drawImage(img, this.position.x, this.position.y, size.width, size.height)
  }

  touchesBorder (borderName: TouchBorderName): boolean {
    switch (borderName) {
      case TouchBorderName.LEFT:
        return this.position.x >= 0
      case TouchBorderName.TOP:
        return this.position.y >= 0
      case TouchBorderName.RIGHT:
        return this.position.x + this.size.width <= this.canvas.width
      case TouchBorderName.BOTTOM:
        return this.position.y + this.size.height <= this.canvas.height
      case TouchBorderName.ANY:
        return (
          this.position.x >= 0
          || this.position.y >= 0
          || this.position.x + this.size.width <= this.canvas.width
          || this.position.y + this.size.height <= this.canvas.height
        )
      case TouchBorderName.NONE:
      default:
        return !(
          this.position.x >= 0
          || this.position.y >= 0
          || this.position.x + this.size.width <= this.canvas.width
          || this.position.y + this.size.height <= this.canvas.height
        )
    }
  }

  setVelocity (x: number = 0, y: number = 0) {
    this.velocity = { x, y }
  }

  update (isMoving: boolean = false) {
    if (isMoving) {
      if (this.touchesBorder(TouchBorderName.LEFT) && this.velocity.x > 0) this.setVelocity(0, 0)
      if (this.touchesBorder(TouchBorderName.RIGHT) && this.velocity.x < 0) this.setVelocity(0, 0)
      if (this.touchesBorder(TouchBorderName.TOP) && this.velocity.y > 0) this.setVelocity(0, 0)
      if (this.touchesBorder(TouchBorderName.BOTTOM) && this.velocity.y < 0) this.setVelocity(0, 0)
    } else this.setVelocity(0, 0)
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

export default GameMap