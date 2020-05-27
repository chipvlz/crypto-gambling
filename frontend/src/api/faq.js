import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/faq/list',
    method: 'post',
    data
  })
}

export function addItem(data) {
  return request({
    url: 'api/faq/add',
    method: 'post',
    data
  })
}
