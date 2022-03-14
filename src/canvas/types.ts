export interface CanvasElement {
  position: IPosition,
  size: ISize,
  canvas: HTMLCanvasElement,
  c: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  velocity: IVelocity,
  update: () => void,
  draw: () => void,
}

export interface IBlock extends CanvasElement {
  id: string, // unique
  offsetX: number, // absolute x position relative to the background
  offsetY: number,
  position: IPosition,
  size: ISize,
  canvas: HTMLCanvasElement,
  c: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  velocity: IVelocity,
  touchRaius: ITouchRaius,
  touchEventCalled: boolean,
  update: () => void,
  draw: () => void,
  updatePosition: (offsetPosition: IPosition) => void,
  clearImage: () => void,
  touchEvent: (body: any) => void,
  [s: string]: any,
  // callback: (offsetPosition: IPosition) => void,
}

export interface ITouchRaius {
  x: number,
  y: number,
}

export interface Background extends CanvasElement {
  position: IPosition,
  size: ISize,
  blocks: IBlock[],
  canvas: HTMLCanvasElement,
  c: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  velocity: IVelocity,
  update: () => void,
  draw: () => void,
  register: (block: IBlock) => {},
}

export interface RoleStatus {
  state: RoleState,
  velocity: IVelocity,
  offsetX: number,
  offsetY: number,
  frame: number,
}

export interface UserFrameInfo {
  uid: number,
  socketId: string,
  username: string,
  status: RoleStatus,
}

export interface IRole {
  position: IPosition,
  size: ISize 
}

export interface IVelocity {
  x: number,
  y: number,
}

export interface IPosition {
  x: number,
  y: number,
}

export interface ISize {
  width: number,
  height: number,
}

export interface CanvasSetting {
  canvas: HTMLCanvasElement,
  c: CanvasRenderingContext2D,
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