import Cookies from 'js-cookie'

const TokenKey = 'Token'
const AdminTokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAdminToken() {
  return Cookies.get(AdminTokenKey)
}

export function setAdminToken(token) {
  return Cookies.set(AdminTokenKey, token)
}

export function removeAdminToken() {
  return Cookies.remove(AdminTokenKey)
}
