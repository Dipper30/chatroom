import { getUID, getUsername } from "../service/utils"
import Block from "./Block"
import CanvasPlayer from "./CanvasPlayer"
import GameMap from "./GameMap"
import MainPlayer from "./MainPlayer"
import NPC from "./NPC"
import NPCChatter from "./NPCChatter"
import Player from "./Player"
import { IWorld, IMainPlayer, NameSpace, ACanvasPlayer, Position, Velocity } from "./types.d"

/**
 * View Layer
 */
export default class World implements IWorld{
  canvas: HTMLCanvasElement | any = document.getElementById('game')
  c: CanvasRenderingContext2D = this.canvas.getContext('2d')
  name: string = ''
  #map: GameMap
  #players: Player[] = []
  #mainPlayer: MainPlayer
  #blocks: Block[] = []
  #npcs: NPC[] = []

  constructor (name: NameSpace) {
    console.log('world!')
    this.name = name
    this.#map = new GameMap(name)
    this.#mainPlayer = new MainPlayer(getUID(), getUsername())
    if (name == 'map1') {
      const npc = new NPCChatter(null, { absX: 473, absY: 300 }, { width: 50, height: 50 }, 20, true, 60)
      this.#blocks.push(npc)
      this.#npcs.push(npc)
    }
  }

  get map (): GameMap {
    return this.#map
  }

  set map (map: GameMap) {
    this.#map = map
  }

  get players (): ACanvasPlayer[] {
    return this.#players
  }

  get mainPlayer () {
    return this.#mainPlayer
  }

  get blocks (): Block[] {
    return this.#blocks
  }

  get npcs (): NPC[] {
    return this.#npcs
  }

  clearAll () {
    this.#blocks = []
    this.#npcs = []
  }

  // check if two circle intersect
  ifIntersect (center1: Position, radius1: number, center2: Position, radius2: number ): boolean {
    return Math.pow((center1.x - center2.x), 2)
    + Math.pow((center1.y - center2.y), 2)
    <= Math.pow((radius1 + radius2), 2)
  }

  /**
   * given center position of a player, determine if he / she collides with any blocks
   */
  detectCollision (player: CanvasPlayer): boolean {    
    for (let block of this.#blocks) {
      if (block.collidable) {
        const playerNextPosition = {
          x: player.position.x + player.size.width / 2 - this.#map.position.x + player.velocity.x,
          y: player.position.y + player.size.height / 2 - this.#map.position.y + player.velocity.y,
        }
        const blockCenterPosition = {
          x: block.absolutePosition.absX + block.size.width / 2,
          y: block.absolutePosition.absY + block.size.height / 2,
        }
        if (this.ifIntersect(playerNextPosition, player.collisionRadius, blockCenterPosition, block.collisionRadius)) {
          // collision happens
          this.map.velocity = { x: 0, y: 0 }
          return true
        }
      }
    }
    return false
  }

  detectEvent (player: CanvasPlayer): boolean {  
    for (let npc of this.#npcs) {
      const playerNextPosition = {
        x: player.position.x + player.size.width / 2 - this.#map.position.x + player.velocity.x,
        y: player.position.y + player.size.height / 2 - this.#map.position.y + player.velocity.y,
      }
      const npcCenterPosition = {
        x: npc.absolutePosition.absX + npc.size.width / 2,
        y: npc.absolutePosition.absY + npc.size.height / 2,
      }
      
      if (this.ifIntersect(playerNextPosition, player.collisionRadius, npcCenterPosition, npc.triggerRadius)) {
        // event triggered
        npc.triggerEvent()
        return true
      } else {
        npc.muteEvent()
      }
    }
    return false
  }

  updateFrameInfo (frameInfo: any) {
    this.#players.map((player, index) => {
      if (frameInfo.has(player.uid)) {
        const { status } = frameInfo.get(player.uid)
        player.position.x = status.absolutePosition.absX - 2*status.velocity.x
        player.position.y = status.absolutePosition.absY - status.velocity.y
        player.velocity = status.velocity
        player.state = status.state
        frameInfo.delete(player.uid)
      }
    })
    if (frameInfo.size > 0) {
      for (let uid of frameInfo.keys()) {
        if (uid != this.#mainPlayer.uid) {
          const p = frameInfo.get(uid)
          const newPlayer = new Player(uid, p.username, 'default')
          this.#players.push(newPlayer)
        }
      }
    }
  }

  render () {
    // console.log('clear');
    // console.log(this.#mainPlayer)
    this.#mainPlayer.clearPrevImage()
    this.#blocks.map((block: Block) => {
      block.clearPrevImage()
    })
    this.#players.map((player: Player) => {
      player.clearPrevImage()
    })
    this.#npcs.map((npc: Block) => {
      npc.clearPrevImage()
    })
    this.#map.clearPrevImage()
    this.#mainPlayer.update()
    this.#players.map((player: Player) => {
      player.update()
    })
    this.#map.update(this.#mainPlayer.isMoving())
    
    // this.c.fillStyle = 'black'
    this.#blocks.map((block: Block) => {
      block.update(this.#map.position)
    })
    this.#map.draw()
    this.#npcs.map((npc: NPC) => {
      npc.update(this.#map.position)
    })
    
    this.#mainPlayer.draw()
    this.#players.map((player: Player) => {
      player.draw()
    })
  }
}