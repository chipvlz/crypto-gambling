import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import config from '@/config'

const baseURL = config.main_port ? config.base_domain + ':' + config.main_port + '/' : config.base_domain + '/'
// create an axios instance
const service = axios.create({
  baseURL: baseURL, // process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else { return res }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
