<template>
  <b-container fluid class="py-4 footer" style="background-color: #1b2132;">
    <b-row no-gutters align-v="end" class="content">
      <b-row no-gutters class="m-auto link-list">
        <div class="link">
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isPrivacyAndPolicy}">PRIVACY AND POLICY</a>
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isResponsibleGaming}">RESPONSIBLE GAMING</a>
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isTermsAndService}">TERMS AND SERVICE</a>
        </div>
      </b-row>
    </b-row>
    <b-row no-gutters align-v="end" class="content mb-3">
      <b-row class="m-auto link-list">
        <div class="link">
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isFaq}">FAQ</a>
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isLegal}">LEGAL</a>
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isProvablyFair}">PROVABLY FAIR</a>
          <a href="/#" class="text-link mr-lg-4 mr-xl-5" :class="{'active': isAbout}">ABOUT</a>
        </div>
      </b-row>
    </b-row>
    <b-row no-gutters align-v="end" class="content copyright1">
      <b-row class="m-auto link-list">
        Copyright &copy; 2020 www.redexc.com All rights reserved. This site is not associated with other bitcoin gaming platforms.
      </b-row>
    </b-row>
  </b-container>
</template>

<script>
import navigation from '@/mixins/navigation'

export default {
  mixins: [navigation],
  computed: {
    isPrivacyAndPolicy: {
      get() {
        return this.$route.path === '/privacy'
      }
    },
    isResponsibleGaming: {
      get() {
        return this.$route.path === '/responsible_gaming'
      }
    },
    isTermsAndService: {
      get() {
        return this.$route.path === '/terms_service'
      }
    },
    isFaq: {
      get() {
        return this.$route.path === '/faq'
      }
    },
    isLegal: {
      get() {
        return this.$route.path === '/legal'
      }
    },
    isProvablyFair: {
      get() {
        return this.$route.path === '/fairness'
      }
    },
    isAbout: {
      get() {
        return this.$route.path === '/about'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .copyright1 {
    border-top: 1px solid #252c41;
    color: #6f778c;
    padding-left: 20px;
    padding-right: 20px;
  }
  .footer {
    padding-left: 0px;
    padding-right: 0px;
  }
  .text-link {
    color: #6f778c;
  }
  .active{
    color: #ffffff;
  }
</style>
