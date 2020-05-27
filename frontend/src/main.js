import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/scss/element-variables.scss'

import BootstrapVue from 'bootstrap-vue'
import { VLazyImagePlugin } from 'v-lazy-image'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretRight, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faPaperPlane, faPlus, faMinus, faInfoCircle, faCross, faLink } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'

import CxltToastr from 'cxlt-vue2-toastr'
import VueClipboard from 'vue-clipboard2'
import Loading from 'vue-loading-overlay'
import SocialSharing from 'vue-social-sharing'

// import VueSocketIO from 'vue-socket.io'

import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import 'vue-loading-overlay/dist/vue-loading.css'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

import './assets/scss/main.scss'
// import './registerServiceWorker'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control
import * as filters from './filters' // global filters

library.add(faCaretRight)
library.add(faChevronDown)
library.add(faChevronUp)
library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faLink)
library.add(faPaperPlane)
library.add(faPlus)
library.add(faMinus)
library.add(faInfoCircle, faCross)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(BootstrapVue)
Vue.use(VLazyImagePlugin)
Vue.use(Loading)
Vue.use(CxltToastr)
Vue.use(VueClipboard)
Vue.use(SocialSharing)
// Vue.use(new VueSocketIO({
//     debug: true,
//     connection: 'https://redexc.com',
//     vuex: {
//         store
//     },
//     secure: true,
// }))
Vue.config.productionTip = false

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
