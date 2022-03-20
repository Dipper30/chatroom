import { createAbstractBuilder } from 'typescript'

export interface IGameElement {
  image: CanvasImage | PlayerSprite,
  position: Position
  velocity: Velocity
  size: Size
  frame: number
  update ([data]: any): void
  draw (): void
  nextFrame(): void
  clearPrevImage (): void
  touchesBorder (borderName: TouchBorderName): boolean
  setVelocity (): void
}

export interface CanvasImage {
  img: HTMLImageElement,
  size: Size,
}

export interface FrameInfo {
  uid: number,
  username: number,
  status: StatusSnapShot,
  socketId: string,
}

export interface StatusSnapShot {
  absolutePosition: AbsolutePosition,
  velocity: Velocity,
  state: RoleState,
}

export interface Collidable {
  collisionRadius: number,
  absolutePosition: AbsolutePosition,
  detectCollision: () => boolean,
}

export interface IHasEvent {
  triggerRadius: number,
  eventTriggered: boolean,
  detectEvent: () => boolean,
}

export abstract class ACanvasPlayer {
  uid: number
  username: string
  canvas: HTMLCanvasElement = document.getElementById('game')
  c: CanvasRenderingContext2D = this.canvas.getContext('2d')
  frame: number
  state: RoleState
  baseVelocity: number
  abstract setState(newState: RoleState): void
}

export interface IMainPlayer extends ACanvasPlayer {
  submitStatus: () => void,
}

export interface SpriteMode {
  cropWidth: number,
  width: number,
  height: number,
  startPosition: {
    x: number,
    y: number,
  },
}

export interface PlayerSprite {
  img: HTMLImageElement,
}

export interface Position {
  x: number,
  y: number,
}

export interface Velocity {
  x: number,
  y: number,
}

export interface AbsolutePosition {
  absX: number,
  absY: number,
}

export interface Size {
  width: number,
  height: number,
}

export interface IWorld {
  map: GameMap,
  players: ACanvasPlayer[],
  mainPlayer: MainPlayer,
}

export type NameSpace = 'map1' | 'map2'
export type DressType = 'default'

export interface RoleStatus {
  state: RoleState,
  velocity: IVelocity,
  offsetX: number,
  offsetY: number,
  frame: number,
}

export enum RoleState {
  LEFT,
  RIGHT,
  HAULT,
  UP,
  DOWN,
  DOWN_HAULT,
  RIGHT_HAULT,
  UP_HAULT,
  LEFT_HAULT,
  CHATTING,
  IDLE,
}

export enum TouchBorderName {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  HORIZONTAL,
  VERTICAL,
  ANY,
  ALL,
  NONE,
}

export enum TouchBlockName {
  UP_FACE,
  DOWN_FACE,
  LEFT_FACE,
  RIGHT_FACE,
  ANY,
  NONE,
}

export enum BlockName {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  HORIZONTAL,
  VERTICAL,
  ANY,
  ALL,
}

export interface BlockEvent {
  b: IBlock,
  callback: () => void,
}