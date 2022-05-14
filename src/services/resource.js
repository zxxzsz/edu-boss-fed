import request from '@/utils/request'

// 按条件分页查询资源接口
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
// 查询资源分类
export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}
