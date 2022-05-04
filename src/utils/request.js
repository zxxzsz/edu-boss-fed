import axios from "axios";

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
  return config
})
export default request
