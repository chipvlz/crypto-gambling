import request from '@/utils/request'

export function game_log(data) {
  return request({
    url: 'api/crash/game_log',
    method: 'post',
    data
  })
}

export function getHistoryList(data) {
  return request({
    url: 'api/crash/history',
    method: 'post',
    data
  })
}

export function getLog(data) {
  return request({
    url: 'api/crash/log',
    method: 'post',
    data
  })
}

export function getToken() {
  var data = {}
  return request({
    url: 'api/crash/get_token',
    method: 'post',
    data
  })
}

export function getGameDetailInfo(data) {
  return request({
    url: 'api/crash/game_detail',
    method: 'post',
    data
  })
}

export function getGameHistory(data) {
  return request({
    url: 'api/crash/game_history',
    method: 'post',
    data
  })
}
