import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  user_id: 0,
  name: '',
  email: '',
  ipaddress: '',
  avatar: '',
  introduction: '',
  wallet: 0,
  wallet_btc: 0,
  wallet_avail: 0,
  wallet_block: 0,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.user_id = id
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_IPADDRESS: (state, ipaddress) => {
    state.ipaddress = ipaddress
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_WALLET: (state, wallet) => {
    state.wallet = wallet
  },
  SET_WALLET_AVAIL: (state, wallet) => {
    state.wallet_avail = wallet
  },
  SET_WALLET_BLOCK: (state, wallet) => {
    state.wallet_block = wallet
  },
  SET_WALLET_BTC: (state, wallet) => {
    state.wallet_btc = wallet
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username_email, password, token } = userInfo
    return new Promise((resolve, reject) => {
      var data = {}
      if (token.length > 0) {
        data = {
          token: token
        }
      } else {
        data = {
          search_key: username_email.trim(),
          password: password
        }
      }
      login(data).then(response => {
        const { data } = response
        if (response.code === 20000) {
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.id)
          setToken(data.token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ token: state.token }).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { ID, USERNAME, EMAIL, AVATAR, IPADDRESS, WALLET_AVAILABLE, WALLET_BLOCK, WALLET } = data
        commit('SET_ID', ID)
        commit('SET_ROLES', '')
        commit('SET_NAME', USERNAME)
        commit('SET_EMAIL', EMAIL)
        commit('SET_AVATAR', AVATAR)
        commit('SET_INTRODUCTION', '')
        commit('SET_WALLET', parseInt(WALLET))
        commit('SET_WALLET_AVAIL', WALLET_AVAILABLE)
        commit('SET_WALLET_BLOCK', WALLET_BLOCK)
        commit('SET_IPADDRESS', IPADDRESS)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
