<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <hamburger v-if="device!=='mobile'" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" style="margin-top:10px;" @toggleClick="toggleSideBar" />
    <el-scrollbar wrap-class="scrollbar-wrapper-admin">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in adminRoutes" :key="'/admin/' + route.path" :item="route" :base-path="'/admin/' + route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/scss/admin_variables.scss'
import Hamburger from '@/components/Hamburger'
import { adminChildRoutes } from '@/router'

export default {
  components: { SidebarItem, Logo, Hamburger },
  data() {
    return {
      adminRoutes: adminChildRoutes
    }
  },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      'sidebar',
      'device'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      // return this.$store.state.settings.sidebarLogo
      return false
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
