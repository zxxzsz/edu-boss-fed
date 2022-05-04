import axios from "axios";
import store from '@/store'
// 通过局部引入方式引入message
import { Message } from 'element-ui'
// 引入router
import router from "@/router"
import qs from 'qs'

// 创建axios实例
const request = axios.create({
  timeout: 2000
  // baseURL: ''
})

function getBaseUrl(url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

request.interceptors.request.use(function (config) {
  // 判断config.url的前缀进行设置baseurl
  config.baseURL = getBaseUrl(config.url)
  // 统一设置token信息
  const { user } = store.state;
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      // currentRoute就是存储路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}

let isRefreshing = false;
// 存储因为等待token刷新挂起的请求
let requestArr = []
// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕，但是状态码为失败
    // 判断失败的状态码情况
    const { status } = error.response;
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 无token信息
      if (!store.state.user) {
        // 跳转登陆页
        redirectLogin()
        return Promise.reject(error)
      }
      // 检测是否已经存在正在刷新token请求
      if (isRefreshing) {
        // 把当前失败的请求存储到请求列表中
        requestArr.push(() => {
          // 当前函数调用后会自动发送本次失败的请求
          request(error.config)
        })
        return;
      }
      isRefreshing = true
      // token无效（错误token，过期token）
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        }).then(res => {
          // 刷新token失败
          if (res.data.state !== 1) {
            //清除无效的用户信息
            store.commit('setUser', null)
            // 跳转到登陆页
            redirectLogin()
            return Promise.reject(error)
          }
          // 刷新token
          store.commit('setUser', res.data.content)
          // 重新发送失败的请求
          // error.config本次请求失败的配置对象
          requestArr.forEach(callback => callback())
          // 清除数组
          requestArr = [];
          // 将本次请求发送
          return request(error.config)
        }).catch(err => { }).finally(() => isRefreshing = false)
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但是未收到响应
    Message.error('请求超时，请重试');
  } else {
    // 意料之外的错误
    Message.error('Error', error.message);
  }
  // 将本次的错误对象继续往后抛出，让接受相应的处理函数进行操作
  return Promise.reject(error)
})
export default request
