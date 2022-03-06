import { Pager } from './common'

export interface User {
  username: string,
  password: string,
  role_id: number,
  role?: string,
  [key: string]: any,
}

export interface AccountInfo {
  id?: number,
  username: string,
  password: string,
}