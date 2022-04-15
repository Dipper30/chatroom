/* eslint-disable no-shadow-restricted-names */
import generator from './notify'
import reduxStore from '../store'
import moment from 'moment'

/**
 * check if the result from request is instance of Error
 * if true, notify error and return false
 * else notify success message and return true
 * @param {any} res 
 * @param {boolean} notifySuccess 
 * @returns 
 */
export const handleResult = (res: any, notifySuccess = true, notifyMessage = 'Success!') => {
  if (isError(res)) {
    // if (res?.code == 10003) {
    //   router.push('/no-auth')
    // }
    // if (res?.code == 10002) {
    //   return true
    // }
    // ElMessage({
    //   message: res?.msg || 'error',
    //   type: 'error',
    // })
    generator.generateNotify(res.msg || 'Unknown Error', 3200, 'error')
    return false
  } else {
    if (notifySuccess) {
      generator.generateNotify(notifyMessage, 3000, 'success')
    }
    return true
  }
}

/**
 * check if the parameter is an Error
 * @param {any} p  
 * @returns boolean
 */
export const isError = (p: any) => {
  return p?.code != 200 && p?.code != 201
}

/**
 * wrap data with user id and auth
 * @param {*} data 
 * @returns new string
 */
export const withUser = (data: any) => {
  const store = reduxStore.getState()
  let uid = store?.user?.id || localStorage.getItem('uid') || null
  console.log(store?.user)
  return `uid:${uid},data:${data},cid:${store?.user.chatroomId}`
}

export const getUID = () => {
  const store = reduxStore.getState()
  return store?.user?.id || Number(localStorage.getItem('uid')) || null
}

export const getRoomId = () => {
  const store = reduxStore.getState()
  return store?.map?.roomInfo?.room?.name || ''
}

export const getUsername = () => {
  const store = reduxStore.getState()
  return store?.user?.username || 'offline'
}

export const getToken = () => {
  return localStorage.getItem('token') || null
}

export const getUser = () => {
  const store = reduxStore.getState()
  return store?.user || null
}

export const getInChat = () => {
  const store = reduxStore.getState()
  return store?.map?.inChat || false
}

export const getMap = () => {
  const store = reduxStore.getState()
  return store?.map || null
}

export const getTickInterval = (): number => {
  const store = reduxStore.getState()
  return store?.map?.tickInterval || 100
} 

/**
 * convert timestamp into string
 */ 
export const formatUnixTSToString = (ts: number, form = 'YYYY-MM-DD HH:mm:ss') => {
  if (!ts || typeof ts != 'number') return ''
  if (ts.toString().length == 10) return moment(ts*1000).format(form)
  return moment(ts).format(form)
}

export const getTS = () => {
  return new Date().getTime()
}

export const reduxDispatch = (action: { type: string, data: any }) => {
  return reduxStore.dispatch(action)
}

type elementOptions = 'canvas' | 'chatinput'

export const focusElement = (ele: elementOptions) => {
  if (ele == 'canvas') {
    const canvas: any = document.querySelector('canvas')
    canvas?.focus()
  } else if (ele == 'chatinput') {
    const chatInput: any = document.getElementById('chatinput')
    const t = setTimeout(() => {
      chatInput?.focus()
      clearTimeout(t)
    }, 600)
    // chatInput?.focus()
  }
}

export const debounce = (fn: (e: KeyboardEvent) => void, interval: number) => {
  let timer: any = null
  return (e: KeyboardEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    // eslint-disable-next-line prefer-rest-params
    if (!timer) {
      // 无timer直接执行
      timer = setTimeout(() => {
        timer = null
      }, interval)
      fn.call(context, e)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.call(context, e)
      }, interval)
    }
  }
}