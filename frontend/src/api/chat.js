import request from '@/utils/request'

export function emit(data) {
  return request({
    url: 'api/chat/post_msg',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/chat/list',
    method: 'post',
    data
  })
}
