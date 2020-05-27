<template>
  <mdb-navbar toggleable="xl" color="white" dark sticky class="top-nav">
    <mdb-navbar-brand href="/">
      <img src="@/assets/img/redexc_logo.png" class="logo mr-sm-3">
    </mdb-navbar-brand>

    <div class="vert-seperator" />

    <div v-if="token!=undefined && token!=''" class="mobile-balance">
      <div class="balance-content">
        <div class="name">{{ name }}</div>
        <div class="price">{{ wallet }}</div>
      </div>
    </div>

    <mdb-navbar-toggler>
      <mdb-navbar-nav class="redex-header py-3">
        <b-nav-item href="/#/home" :class="{'link-active': isHomeActive}">
          <img src="@/assets/img/ic_bits2usd.png" class="mr-sm">
          Crash
        </b-nav-item>
        <b-nav-item v-if="token!=undefined && token!=''" href="/#/deposit" :class="{'link-active': isDepositActive}">
          <img src="@/assets/img/ic_leaderboard.png" class="mr-sm">
          Deposit
        </b-nav-item>
        <b-nav-item v-if="token!=undefined && token!=''" href="/#/profile" class="mobile-item" :class="{'link-active': isProfileActive}">
          Profile
        </b-nav-item>
        <b-nav-item v-if="token!=undefined && token!=''" href="/#/referral" class="mobile-item" :class="{'link-active': isReferralActive}">
          Referral
        </b-nav-item>
        <b-nav-item v-if="token===undefined || token===''" href="#" class="mobile-item" @click="logIn">
          LogIn
        </b-nav-item>
        <b-nav-item v-if="token===undefined || token===''" href="#" class="mobile-item" @click="signUp">
          SignUp
        </b-nav-item>
        <!-- <b-nav-item href="/#/faq" :class="{'link-active': isFaqActive}">
          <img src="@/assets/img/ic_faq.png" class="mr-sm">
          FAQ
        </b-nav-item>
        <b-nav-item href="/#/fairness" :class="{'link-active': isFairnessActive}">
          <img src="@/assets/img/ic_referral.png" class="mr-sm">
          Provably Fair
        </b-nav-item> -->
      </mdb-navbar-nav>
      <div class="d-flex desktop-auth">
        <profile-select v-if="token!=undefined && token!=''" :avatar-bits="wallet" :avatar-name="name" :avatar-image="avatar" />
        <log-in-button v-if="token==undefined || token==''" text="LogIn" class="login" @click="logIn" />
        <log-in-button v-if="token==undefined || token==''" text="SignUp" class="signup" @click="signUp" />
      </div>
    </mdb-navbar-toggler>
  </mdb-navbar>
</template>

<script>
import { mapGetters } from 'vuex'
import navigation from '@/mixins/navigation'
import ProfileSelect from '@/components/navbar/ProfileSelect'
import LogInButton from '@/components/navbar/LogInButton'
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav } from 'mdbvue'

export default {
  components: {
    ProfileSelect,
    LogInButton,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav
  },
  mixins: [navigation],
  data() {
    return {
      loginForm: {
        username: 'Test Account',
        email: 'test@test.com',
        password: '1111'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'name',
      'wallet',
      'avatar'
    ]),
    isHomeActive: {
      get() {
        return this.$route.path === '/home'
      }
    },
    isDepositActive: {
      get() {
        return this.$route.path === '/deposit'
      }
    },
    isWithdrawActive: {
      get() {
        return this.$route.path === '/withdraw'
      }
    },
    isFaqActive: {
      get() {
        return this.$route.path === '/faq'
      }
    },
    isReferralActive: {
      get() {
        return this.$route.path === '/referral'
      }
    },
    isFairnessActive: {
      get() {
        return this.$route.path === '/fairness'
      }
    },
    isProfileActive: {
      get() {
        return this.$route.path === '/profile'
      }
    }
  },
  methods: {
    logIn() {
      this.$bvModal.show('login-form')
    },
    signUp() {
      this.$bvModal.show('signup-form')
    }
  }
}
</script>
<style lang="scss" scoped>
.profile-bar-wrapper {
  float: right;
  .login {
  }
  .signup {
  }
  .video-guide {
    width: 40px;
    height: 40px;
  }
}
.navbar-collapse.collapse.show .navbar-nav-wrapper .profile-bar-wrapper.navbar-nav {
    border: none;
    .nav-item {
      height: 57px;
    }
}

@media (min-width: 1200px)
{
  #nav-collapse {
    margin-left: 1rem;
  }
}

</style>
