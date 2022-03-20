import CanvasPlayer from './CanvasPlayer'
import Game from './Game'
import { DressType, IGameElement, RoleState } from './types.d'

class Player extends CanvasPlayer implements IGameElement {

  constructor (uid: number, username: string, dressType: DressType) {
    super(uid, username, dressType)
  }

  setState (newState: RoleState) {
    this.state = newState
  }

  update () {
    if (this.detectCollision()) {
      this.setVelocity(0, 0)
    }
    this.position.x = this.position.x + this.velocity.x
    this.position.y = this.position.y + this.velocity.y
  }

  draw () {
    this.determineCurrentAnimation()
  }

  /**
   * draw image with a computed start postion
   * @param startX 
   * @param startY 
   */
   drawWithContext (frame: number) {
    const game = Game.getInstance()
    const world = game.getCurrentWorld()
    const w = this.c.measureText(this.username).width
    this.c.strokeStyle = '#23ade5'
    this.c.font = '12px Monaco'
    this.c.strokeText(this.username, this.position.x + world.map.position.x - 10 + (this.size.width + 20 - w) / 2, this.position.y + world.map.position.y, this.size.width + 20)

    const spriteMode = this.getSpriteMode()
    this.c.drawImage(
      this.image.img,
      spriteMode.startPosition.x + spriteMode.cropWidth * frame,
      spriteMode.startPosition.y,
      spriteMode.width,
      spriteMode.height,
      world.map.position.x + this.position.x, // move realative to the map
      world.map.position.y + this.position.y,
      this.size.width,
      this.size.height,
    )
  }
  
}

export default Player