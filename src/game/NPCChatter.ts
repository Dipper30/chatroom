import Game from './Game'
import NPC from './NPC'
import { AbsolutePosition, Size } from './types.d'

class NPCChatter extends NPC {

  protected roomId: string = 'room1'

  constructor (spriteConfig: unknown, absolutePosition: AbsolutePosition, size: Size, collisionRadius?: number, collidable?: boolean, triggerRadius?: number) {
    super(spriteConfig, absolutePosition, size, collisionRadius, collidable, triggerRadius)
  }

  triggerEvent (): void {
    this.eventTriggered = true
    this.keydownEvent = this.keydownEvent.bind(this)
    this.canvas.addEventListener('keydown', this.keydownEvent)
    // this.drawDialog()
  }

  muteEvent (): void {
    if (this.eventTriggered == false) return
    this.eventTriggered = false
    this.canvas.removeEventListener('keydown', this.keydownEvent)
  }

  keydownEvent (e: KeyboardEvent) {
    switch (e.code) {
      case 'Enter':
        // eslint-disable-next-line no-case-declarations
        const game = Game.getInstance()
        this.eventTriggered && game.enterChatroom(this.roomId)
        // game.getCurrentWorld().mainPlayer.removeKeyboardEvent()
        break
    }
  }

  drawDialog () {
    this.c.fillStyle = '#222'
    this.c.fillRect(this.position.x - 60, this.position.y - 60, 230, 40)
    this.c.strokeStyle = '#aaa'
    this.c.font = '14px Monaco'
    this.c.strokeText('Let\'s Chat! (Press Enter)', this.position.x - 45, this.position.y - 35)
  }

  draw () {
    this.c.fillStyle = 'rgba(22%, 22%, 22%,0.9)'
    this.c.fillRect(this.position.x, this.position.y - 18, 50, 20)
    this.c.strokeStyle = '#eee'
    this.c.font = '12px Monaco'
    this.c.strokeText('Marry', this.position.x + 8, this.position.y - 5)
    // this.c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    if (this.eventTriggered) this.drawDialog()
  }
}

export default NPCChatter