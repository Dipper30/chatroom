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
export const handleResult = (res, notifySuccess = true, notifyMessage = 'Success!') => {
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
export const isError = p => {
  return p?.code != 200 && p?.code != 201
}

/**
 * wrap data with user id and auth
 * @param {*} data 
 * @returns new string
 */
export const withUser = (data) => {
  const store = reduxStore.getState()
  let uid = store?.user?.id || localStorage.getItem('uid') || null
  console.log(store?.user)
  return `uid:${uid},data:${data},cid:${store?.user.chatroomId}`
}

export const getUID = () => {
  const store = reduxStore.getState()
  return store?.user?.id || localStorage.getItem('uid') || null
}

/**
 * convert timestamp into string
 */ 
export const formatUnixTSToString = (ts, form = 'YYYY-MM-DD HH:mm:ss') => {
  if (!ts || typeof ts != 'number') return ''
  if (ts.toString().length == 10) return moment(ts*1000).format(form)
  return moment(ts).format(form)
}
