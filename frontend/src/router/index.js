import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Admin Layout */
import AdminLayout from '@/layouts/AdminMain'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('../layouts/Main.vue'),
    children: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        component: () => import('../views/Home.vue'),
        meta: { title: '' },
        name: 'home'
      },
      {
        path: '/deposit',
        component: () => import('../views/deposit.vue'),
        meta: { title: 'Deposit' }
      },
      {
        path: '/withdraw',
        component: () => import('../views/withdraw.vue'),
        meta: { title: 'Withdraw' }
      },
      {
        path: '/referral',
        component: () => import('../views/Referral.vue'),
        meta: { title: 'Referral' }
      },
      {
        path: '/my_referral',
        component: () => import('../views/my_referral.vue'),
        meta: { title: 'My Referral' }
      },
      {
        path: '/faq',
        component: () => import('../views/faq.vue'),
        meta: { title: 'FAQ' }
      },
      {
        path: '/fairness',
        component: () => import('../views/fairness.vue'),
        meta: { title: 'Provably Fair' }
      },
      {
        path: '/profile',
        component: () => import('../views/profile.vue'),
        meta: { title: 'My Profile Settings' }
      },
      {
        path: '/history',
        component: () => import('../views/history.vue'),
        meta: { title: 'Crash History' },
        name: 'history'
      },
      {
        path: '/reset_password',
        component: () => import('../views/Resetpassword.vue'),
        meta: { title: 'Reset Password' },
        name: 'reset'
      },
      {
        path: '/privacy',
        component: () => import('../views/privacy.vue'),
        meta: { title: 'Privacy and Policy' },
        name: 'Privacy'
      },
      {
        path: '/terms_service',
        component: () => import('../views/terms_and_service.vue'),
        meta: { title: 'Terms And Service' },
        name: 'Terms'
      },
      {
        path: '/responsible_gaming',
        component: () => import('../views/responsible_gaming.vue'),
        meta: { title: 'Responsible Gaming' },
        name: 'Responsible'
      },
      {
        path: '/legal',
        component: () => import('../views/legal.vue'),
        meta: { title: 'Legal' },
        name: 'Legal'
      },
      {
        path: '/about',
        component: () => import('../views/about.vue'),
        meta: { title: 'About' },
        name: 'About'
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/admin/login/index'),
    hidden: true
  }
]
export const adminChildRoutes = [
  {
    path: 'dashboard',
    component: () => import('@/views/admin/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'dashboard'
    }
  },
  {
    path: 'users',
    component: () => import('@/views/admin/users'),
    name: 'Users',
    meta: {
      title: 'Users',
      icon: 'user'
    }
  },
  {
    path: 'admin_user',
    component: () => import('@/views/admin/admin_user'),
    name: 'AdminUser',
    meta: {
      title: 'Admin',
      icon: 'password'
    }
  },
  {
    path: 'referral',
    component: () => import('@/views/admin/referral'),
    name: 'Referral',
    props: true,
    meta: {
      title: 'Referral',
      icon: 'form'
    }
  },
  {
    path: 'setting',
    component: () => import('@/views/admin/setting'),
    name: 'Setting',
    meta: {
      title: 'Setting',
      icon: 'eye-open'
    }
  },
  {
    path: 'bot',
    component: () => import('@/views/admin/bot'),
    name: 'Bot',
    meta: {
      title: 'Bot',
      icon: 'peoples'
    }
  },
  {
    path: 'wallet',
    component: () => import('@/views/admin/wallet/index'), // Parent router-view
    name: 'Wallet',
    meta: { title: 'Wallet', icon: 'money' },
    redirect: '/admin/wallet/deposit',
    children: [
      {
        path: 'deposit',
        component: () => import('@/views/admin/wallet/deposit'),
        name: 'Deposit',
        meta: {
          title: 'Deposit'
        }
      },
      {
        path: 'withdraw',
        component: () => import('@/views/admin/wallet/withdraw'),
        name: 'Withdraw',
        meta: {
          title: 'Withdraw'
        }
      }
    ]
  },
  {
    path: 'crash',
    component: () => import('@/views/admin/crash/index'), // Parent router-view
    name: 'Crash',
    meta: { title: 'Crash', icon: 'star' },
    redirect: '/admin/crash/gamehistory',
    children: [
      {
        path: 'gamehistory',
        component: () => import('@/views/admin/crash/gamehistory'),
        name: 'GameHistory',
        meta: {
          title: 'GameHistory'
        }
      }
    ]
  },
  {
    path: 'pages',
    component: () => import('@/views/admin/pages/index'), // Parent router-view
    name: 'Pages',
    meta: { title: 'Pages', icon: 'nested' },
    redirect: '/admin/pages/faq',
    children: [
      {
        path: 'privacy',
        component: () => import('@/views/admin/pages/privacy'),
        name: 'Privacy',
        meta: {
          title: 'Privacy and Policy'
        }
      },
      {
        path: 'responsible_gaming',
        component: () => import('@/views/admin/pages/responsible_gaming'),
        name: 'Responsible',
        meta: {
          title: 'Responsible Gaming'
        }
      },
      {
        path: 'terms_service',
        component: () => import('@/views/admin/pages/terms_service'),
        name: 'Terms',
        meta: {
          title: 'Terms And Service'
        }
      },
      {
        path: 'faq',
        component: () => import('@/views/admin/pages/faq'),
        name: 'Faq',
        meta: {
          title: 'Faq'
        }
      },
      {
        path: 'legal',
        component: () => import('@/views/admin/pages/legal'),
        name: 'Legal',
        meta: {
          title: 'Legal'
        }
      },
      {
        path: 'about',
        component: () => import('@/views/admin/pages/about'),
        name: 'About',
        meta: {
          title: 'About'
        }
      }
    ]
  }/*
  {
    path: 'faq',
    component: () => import('@/views/admin/faq'),
    name: 'Faq',
    meta: {
      title: 'Faq',
      icon: 'nested'
    }
  } */
]
export const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    alwaysShow: true,
    props: true,
    name: 'Admin',
    meta: {
      title: 'Admin'
    },
    children: adminChildRoutes
  }
]
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })
const createRouter = () => new VueRouter({
  // // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  // routes: constantRoutes
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: constantRoutes.concat(adminRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
