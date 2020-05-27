import Cookies from 'js-cookie'
import config from '@/config'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  base_domain: '45.76.180.140',
  crash_server_url: config.crash_port ? config.base_domain + ':' + config.crash_port : config.base_domain,
  chat_server_url: config.chat_port ? config.base_domain + ':' + config.chat_port : config.base_domain,
  crash_chat: 'crash_chat',
  detail_id: 0
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_DETAILID: (state, detail_id) => {
    state.detail_id = detail_id
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setDetailId({ commit }, param) {
    const { detail_id } = param
    commit('SET_DETAILID', detail_id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
