import generator from './notify'

/**
 * check if the result from request is instance of Error
 * if true, notify error and return false
 * else notify success message and return true
 * @param {any} res 
 * @param {boolean} notifySuccess 
 * @returns 
 */
export const handleResult = (res, notifySuccess = true, notifyMessage = 'Success!') => {
  console.log(generator)
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
    generator.generateNotify(res.msg || 'Unknown Error', 3500, 'error')
    return false
  } else {
    if (notifySuccess) {
      generator.generateNotify(notifyMessage, 3500, 'success')
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