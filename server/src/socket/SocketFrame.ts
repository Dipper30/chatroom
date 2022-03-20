export interface UserFrameInfo {
  uid: number,
  socketId: string,
  username: string,
  status: {
    state: number,
    velocity: {
      x: number,
      y: number,
    },
    offsetX: number,
    offsetY: number,
    frame: number,
  }
}
const delay = process.env.INTERVAL

export default class SocketFrame {
  io: any = null
  timer: any = null

  // user information in current frame
  userFrameInfo: Map<number, UserFrameInfo> = new Map()
  toLeave: number[] = [] // record user ids who have left sokcets
  // previouslyUpdated = []

  static instance: SocketFrame | null = null

  constructor (io: any) {
    this.io = io
  }

  static getInstance (io: any): SocketFrame {
    if (!this.instance) {
      this.instance = new SocketFrame(io)
    }
    return this.instance
  }

  startFrameUpdate (interval: number = Number(delay)) {
    if (this.io) {
      this.timer = setInterval(async () => {
        // after JSON.stringify, Map converted into {}
        // so use an array here
        if (this.userFrameInfo.size != 0) this.io.emit('frameInfo', { msg: 'frame info', data: Array.from(this.userFrameInfo) })
        if (this.toLeave.length > 0) {
          this.io.emit('toLeave', { msg: 'someone leaves', data: this.toLeave })
          this.toLeave = []
        }
        this.clearPreviousFrame()
      }, interval)
    }
  }

  // remove a role frame
  removeFrameInfo (uid: number) {
    this.toLeave.push(uid)
    // this.userFrameInfo.delete(uid)
  }

  clearPreviousFrame () {
    this.userFrameInfo = new Map<number, UserFrameInfo>()
  }

  updateUserFrameInfo (frameInfo: UserFrameInfo) {
    this.userFrameInfo.set(frameInfo.uid, frameInfo)
    // console.log(this.userFrameInfo)
  }

  stopFrameupdate () {
    clearInterval(this.timer)
    this.timer = null
  }
}