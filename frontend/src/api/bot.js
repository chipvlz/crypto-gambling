import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: 'api/bot/list',
    method: 'post',
    data
  })
}

export function updateBot(data) {
  return request({
    url: 'api/bot/update',
    method: 'post',
    data
  })
}

export function addBot(data) {
  return request({
    url: 'api/bot/add',
    method: 'post',
    data
  })
}

export function applyBot(data) {
  return request({
    url: 'api/crash/bot_apply',
    method: 'post',
    data
  })
}
