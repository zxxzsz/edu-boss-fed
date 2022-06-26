import request from '@/utils/request'

// 分野查询课程信息
export const getQueryCourses = data => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架
export const changeState = data => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params: data
  })
}

// 保存或者更改课程信息
export const saveOrUpdateCourse = data => {
  return request.post('/boss/course/saveOrUpdateCourse', data)
}

// 上传图片接口
export const uploadCourseImage = (data, onUploadProgress) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}

export const getCourseById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: { courseId }
  })
}
