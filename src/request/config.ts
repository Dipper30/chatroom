import { http, get, post, uploadFiles } from './http'

export const login = (params: {username: string, password: string}) => {
  return post('/login', params)
}

export const loginByToken = () => {
  return post('/token')
}

/**
 * get messages using token
 */
export const getMessage = () => {
  return get('/getMessage')
}