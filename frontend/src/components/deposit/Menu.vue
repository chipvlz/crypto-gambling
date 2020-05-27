<template>
  <div ref="menu" :class="{show:show}" class="menu-container">
    <div class="menu-background" />
    <div class="menu">
      <div class="handle-button" :style="{'top':buttonTop+'px'}" @click="showOrHide">
        <font-awesome-icon :icon="show?'chevron-left' : 'chevron-right'" />
      </div>
      <div class="menu-header flex-space-between-vc">
        <menu-header-btn :type="0" @click="showOrHide" />
        <menu-header-btn :type="1" />
      </div>
      <div class="menu-content">
        <user-info-sect class="user-sect" />
        <div class="flex-space-between-vc m-b">
          <deposit-btn type="deposit" />
          <deposit-btn type="withdraw" />
        </div>
        <div class="menu-seperator m-b" />
        <div>
          <div class="menu-item-row flex-row-hl-vc">
            <menu-item class="menu-item-col" type="settings" />
            <div class="menu-vert-seperator" />
            <menu-item class="menu-item-col" type="referrals" />
          </div>
          <div class="menu-seperator" />
          <div class="menu-item-row flex-row-hl-vc">
            <menu-item class="menu-item-col" type="ranking" />
            <div class="menu-vert-seperator" />
            <menu-item class="menu-item-col" type="rewards" />
          </div>
          <div class="menu-seperator" />
          <div class="menu-item-row flex-row-hl-vc">
            <menu-item class="menu-item-col" type="my games" />
            <div class="menu-vert-seperator" />
            <menu-item class="menu-item-col" type="message" />
          </div>
          <div class="menu-seperator" />
          <div class="menu-item-row flex-row-hl-vc">
            <menu-item class="menu-item-col" type="help center" />
            <div class="menu-vert-seperator" />
            <div class="menu-item-col" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { addClass, removeClass } from '@/utils'
import MenuHeaderBtn from '@/components/deposit/MenuHeaderBtn'
import UserInfoSect from '@/components/deposit/UserInfoSect'
import DepositBtn from '@/components/deposit/DepositBtn'
import MenuItem from '@/components/deposit/MenuItem'

export default {
  name: 'Menu',
  components: {
    MenuHeaderBtn,
    UserInfoSect,
    DepositBtn,
    MenuItem
  },
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'chat_server_url',
      'user_id',
      'name',
      'ipaddress',
      'token',
      'crash_chat',
      'avatar'
    ])
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      //   if (value) {
      //     addClass(document.body, 'showChat')
      //   } else {
      //     removeClass(document.body, 'showChat')
      //   }
    }
  },
  mounted() {
    // this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.menu
    elx.remove()
  },
  created: function() {
    this.$emit('showOrHide', this.show)
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.menu')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
      this.$emit('showOrHide', this.show)
    },
    showOrHide() {
      this.show = !this.show
      this.$emit('showOrHide', this.show)
    }
    // insertToBody() {
    //   const elx = this.$refs.chat
    //   const body = document.querySelector('body')
    //   body.insertBefore(elx, body.firstChild)
    // }
  }
}
</script>

<style>
/* .showChat {
  overflow: hidden
  position: relative
  width: calc(100% - 15px)
} */
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.menu-container {
  height: 100%;
}
.menu-background {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  @include media-breakpoint-up(md) {
    display: none;
  }
  @include media-breakpoint-down(md) {
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }
  background: rgba(0, 0, 0, 0.2);
}

.menu {
  width: 100%;
  width: calc(#{$menu-width});
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  // @include media-breakpoint-down(md) {
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  // }
  transform: translate(-100%);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  background: $navbar-bg-color;
  @include media-breakpoint-up(md) {
    position: absolute;
  }
}

.show {
  // @include media-breakpoint-down(md) {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  // }

  .menu-background {
    opacity: 1;
    @include media-breakpoint-up(md) {
      opacity: 0;
    }
    width: 100%;
    height: 100%;
  }

  .menu {
    transform: translate(0);
    // @include media-breakpoint-down(md) {
    //   transform: translate(0);
    // }
  }
  .handle-button {
    display: none;
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  right: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
  // @include media-breakpoint-up(md) {
  //   display: none;
  // }
}
.menu-header {
  height: 85px;
  background: $sidebar-header-bg-color;
  color: white;
}

.menu-content {
  padding-left: $menu-padding-left-right;
  padding-right: $menu-padding-left-right;
  .user-sect {
    margin-top: 48px;
    margin-bottom: 48px;
  }
  .menu-seperator {
    width: 100%;
    height: 1px;
    background-color: $user-tbl-header-border-color;
  }
  .menu-item-row {
    width: 100%;
  }
  .menu-item-col {
    width: calc(50% - 1px)
  }
  .menu-vert-seperator {
    width: 1px;
    background-color: $user-tbl-header-border-color;
    height: $menu-item-height;
  }
}
.m-b {
  margin-bottom: $normal-margin-bottom-lg;
}

</style>
