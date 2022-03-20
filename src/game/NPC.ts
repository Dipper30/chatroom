import Block from './Block'
import { AbsolutePosition, IHasEvent, Size } from './types.d'

class NPC extends Block implements IHasEvent {
  triggerRadius: number
  eventTriggered: boolean = false

  constructor (spriteConfig: unknown, absolutePosition: AbsolutePosition, size: Size, collisionRadius: number = 0, collidable: boolean = true, triggerRadius : number = 20) {
    super(spriteConfig, absolutePosition, size, collisionRadius, collidable)
    this.triggerRadius = triggerRadius
  }

  triggerEvent (): void {
    // do something
    console.log('trigger!!')
    
    this.eventTriggered = true
  }

  muteEvent (): void {
    if (this.eventTriggered == false) return
    this.eventTriggered = false
  }

  detectEvent (): boolean {
    //
    return false
  }

  draw () {
    //
  }
  
}

export default NPC