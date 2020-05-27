<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { isWithdrawRequest } from '@/api/bitcoin'
import message from '@/filters/message'
import notification from '@/mixins/notification'

const routeCheck = ['/', '/home', '/faq', '/fairness', '/history', '/deposit', '/withdraw', '/referral', '/profile', '/login', '/admin/wallet/withdraw']

export default {
  name: 'AdminLayout',
  components: {
    AppMain,
    Navbar,
    // RightPanel,
    // Settings,
    Sidebar
    // TagsView
  },
  mixins: [ResizeMixin, notification],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    var self = this
    setInterval(() => {
      self.check()
    }, 30000)
  },
  methods: {
    check() {
      if (routeCheck.indexOf(this.$route.path) !== -1) { return }
      isWithdrawRequest({}).then(response => {
        if (response.status === 'success' && response.data) {
          this.showNotification('Notification', message.withdrawCheck, 'success')
        }
      })
        .catch(() => {
          this.showNotification('Error', message.disconnect_err_msg1, 'error')
        })
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/mixin.scss";
  @import "~@/assets/scss/admin_variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
