import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getAdminToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/', '/home', '/faq', '/fairness', '/history', '/reset_password', '/privacy', '/terms_service', '/responsible_gaming', '/legal', '/about'] // no redirect whitelist
const adminWhiteList = ['/login']
const adminDependenceList = ['/admin/dashboard', '/admin/users', '/admin/admin_user', '/admin/referral', '/admin/setting', '/admin/bot', '/admin/wallet/deposit', '/admin/wallet/withdraw', '/admin/crash/gamehistory', '/admin/pages/faq', '/admin/pages/privacy', '/admin/pages/responsible_gaming', '/admin/pages/terms_service', '/admin/pages/legal', '/admin/pages/about']
const dependenceList = ['/deposit', '/withdraw', '/referral', '/my_referral', '/profile']
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasAdminToken = getAdminToken()

  // in the free login white list for user panel
  if (whiteList.indexOf(to.path) !== -1) {
    if (!(hasToken === undefined || hasToken == null)) {
      store.dispatch('user/getInfo')
    }
    next()
  } else if (adminWhiteList.indexOf(to.path) !== -1) {
    if (!(hasAdminToken === undefined || hasAdminToken == null)) {
      next({ path: '/admin/' })
      NProgress.done()
    } else {
      next()
    }
  } else if (adminDependenceList.indexOf(to.path) !== -1) {
    if (!(hasAdminToken === undefined || hasAdminToken == null)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } else if (dependenceList.indexOf(to.path) !== -1) {
    if (!(hasToken === undefined || hasToken == null)) {
      store.dispatch('user/getInfo')
      next()
    } else {
      // console.log('dhdsakfj;adskljf;asdkfj')
      next({ path: '/home' })
      NProgress.done()
    }
  } else {
    next({ path: '/home' })
    NProgress.done()
  }
  /*
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    if (!(hasToken === undefined || hasToken == null)) {
      store.dispatch('user/getInfo')
    }
    if (hasAdminToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/admin/' })
        NProgress.done()
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    if (hasAdminToken) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } */
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
