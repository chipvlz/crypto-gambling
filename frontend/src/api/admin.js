import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/admin_user/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: 'api/admin_user/info',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'api/admin_user/logout',
    method: 'post'
  })
}

export function updateInfo(data) {
  return request({
    url: 'api/admin_user/update',
    method: 'post',
    data
  })
}

// export function signup(data) {
//   return request({
//     url: 'api/admin/signup',
//     method: 'post',
//     data
//   })
// }
