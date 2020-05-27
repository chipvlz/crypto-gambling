<template>
  <div>
    <!-- <app-navbar /> -->
    <gal-navbar />

    <div class="app-container">
      <div class="flex-row" style="position: relative;">
        <router-view style="width: 100%" />
        <!-- <chat /> -->
      </div>
      <app-footer />
    </div>
    <log-in-form />
    <sign-up-form />
    <crash-game-detail />
  </div>
</template>

<script>
// import AppNavbar from '@/components/layouts/Navbar.vue';
import AppFooter from '@/components/layouts/Footer.vue'
import GalNavbar from '@/components/layouts/GalNavbar.vue'
import LogInForm from '@/components/user/LogInForm.vue'
import SignUpForm from '@/components/user/SignUpForm.vue'
import CrashGameDetail from '@/components/main/CrashGameDetail.vue'
// import Chat from '@/components/chat/Chat.vue'

export default {
  components: {
    AppFooter,
    GalNavbar,
    LogInForm,
    SignUpForm,
    // Chat,
    CrashGameDetail
  }
}
</script>
