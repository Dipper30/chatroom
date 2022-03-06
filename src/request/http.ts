import axios, { AxiosResponse } from 'axios'
import env from '../config'
console.log('base_url', env.SERVER_URL)
// const apiBaseURL = env.SERVER_URL + '/api/v1'
const apiBaseURL = process.env.REACT_APP_ENVIRONMENT == 'local' ? 'http://10.0.0.154:8080/api/v1' : 
  (process.env.REACT_APP_ENVIRONMENT == 'development' ? 'http://localhost:8080/api/v1' : '')
// export const apiBaseURL = `http://localhost:3000/api/v1`

// export const apiBaseURL = `//${window.location.host}/api/v1`;
// export const baseURL = `//${window.location.host}/signing-up`;

export const mHttpConfig = {
  warn: 0,
}

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true,
})

http.defaults.headers.post['Content-Type'] = 'application/json'
// let token = localStorage.getItem('token')
// if (token) http.defaults.headers.common['token'] = token
// try {
//   let token = localStorage.getItem('token')
//   if (token) http.defaults.headers.post['token'] = token
// } catch (error) {
//   // do nothing
// }

http.interceptors.request.use(
  (config: any) => {
    // const token = store.getters.getToken
    // config.headers.token = token
    return config
  },
)

http.interceptors.response.use(
  (response: any) => {
    const { data } = response
    const { code, msg } = data
    switch (code) {
    case 0:
      return data
    case 10002:
      // token error
      console.log('wrong token, please relogin')
  
      return { code, msg }
    // case 10003:
    //   console.log('not authorized')
    //   window.open('no-auth')
    //   break
    default:
      // if (mHttpConfig.warn === 0) {
      //   ElMessage.error('网络错误：' + msg);
      // }
      // throw msg;
      return data
    }
  },
  (error: Error) => error,
)

/**
 * get request
 */
export const get = (url: string, params: any): Promise<AxiosResponse<any, any>> => {
  if (!params) return http.get(url)
  let count = 1
  for (let attr in params) {
    url += count == 1 ? '?' : '&' 
    url += (attr + '=' + params[attr])
    count++
  }
  return http.get(url)
}

/**
 * post request
 */
export const post = (url: string, params: any): Promise<AxiosResponse<any, any>> => {
  return http.post(url, params)
}

/**
 * file uploader
 */
export const uploadFiles = (url: string, files: File[], param: any[]) => {
  // const file = e.target.files[0]
  const formData = new FormData()
  for (let p of param) formData.append(p.prop, p.value)
  for (let file of files) formData.append('file', file)
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  })
}