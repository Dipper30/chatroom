import { AbsolutePosition, CanvasImage, Collidable, IGameElement, IHasEvent, PlayerSprite, Position, Size, TouchBorderName, Velocity } from "./types.d"
function WillTriggerEvent (target: any) {
  target.eventTriggered = false
}

@WillTriggerEvent
class Block implements IGameElement, Collidable {
  canvas: HTMLCanvasElement | any = document.getElementById('game')
  c: CanvasRenderingContext2D = this.canvas.getContext('2d')
  collisionRadius: number
  image: CanvasImage | PlayerSprite
  absolutePosition: AbsolutePosition
  position: Position
  velocity: Velocity = { x: 0, y: 0 }
  size: Size
  frame: number = 0
  spriteConfig: any
  collidable: boolean

  constructor (spriteConfig: any, absolutePosition: AbsolutePosition, size: Size, collisionRadius: number = 0, collidable: boolean = true) {
    if (spriteConfig) this.spriteConfig = spriteConfig
    this.absolutePosition = absolutePosition
    this.position = { x: this.absolutePosition.absX, y: this.absolutePosition.absY }
    this.size = size
    this.collisionRadius = collisionRadius
    this.image = {
      img: new Image(),
      size,
    }
    this.collidable = collidable
  }

  computeCenterPosition (mapPosition: Position): AbsolutePosition {
    return {
      absX: mapPosition.x + this.absolutePosition.absX + this.size.width / 2,
      absY: mapPosition.y + this.absolutePosition.absY + this.size.height / 2,
    }
  }

  detectCollision (): boolean {
    // if (this.collidable)

    return false
  }

  update (mapPosition: Position): void {
    this.position.x = mapPosition.x + this.absolutePosition.absX
    this.position.y = mapPosition.y + this.absolutePosition.absY
    this.draw()
  }
  draw (): void {
    //
    this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }
  nextFrame (): void {
    this.frame++
  }
  clearPrevImage (): void {
    this.c.clearRect(this.absolutePosition.absX, this.absolutePosition.absY, this.size.width, this.size.height)
  }
  touchesBorder (borderName: TouchBorderName): boolean {
    throw new Error("Method not implemented.")
  }
  setVelocity (): void {
    throw new Error("Method not implemented.")
  }

}

export default Block