export interface SocketRouter {
  route: string,
  callback: (...args: any[]) => void,
}

export const emitRouter: SocketRouter[] = [
  {
    route: 'message',
    callback: (data: string) => console.log('msg ', data),
  },
]

export const onRouter: SocketRouter[] = [
  {
    route: 'message',
    callback: (data: string) => console.log('msg ', data),
  },
]
