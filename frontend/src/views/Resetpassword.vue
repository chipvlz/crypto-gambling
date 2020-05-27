<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center profile-title">
              <b-col class="label">
                Reset password
              </b-col>
            </b-row>
            <b-row class="text-center profile-desc">
              <b-col class="label">
                Choose your new password
              </b-col>
            </b-row>
            <b-row class="seperator m-t-30" />
            <b-row class="profile-sub-title">
              <b-col class="label">
                Please enter a new password.
              </b-col>
            </b-row>
            <b-row class="profile-username m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="2" sm="2" class="label">New password:</b-col>
              <b-col xl="4" lg="5" md="6" sm="8" class="bg flex-space-between-vc">
                <input
                  v-model="user_new_password"
                  class="text"
                  type="password"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @input="handleInput"
                >
              </b-col>
            </b-row>
            <b-row class="profile-username m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="2" sm="2" class="label">Confirm password:</b-col>
              <b-col xl="4" lg="5" md="6" sm="8" class="bg flex-space-between-vc">
                <input
                  v-model="user_new_password_confirm"
                  class="text"
                  type="password"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @input="handleInput"
                >
              </b-col>
            </b-row>
            <b-row class="profile-security-button m-t-15">
              <b-col xl="4" lg="4" md="3" sm="3" />
              <b-col xl="4" lg="5" md="6" sm="8" class="button-row">
                <crash-button text="Reset" class="profile-security-change-button" @click="resetUserpasswordFunc" />
              </b-col>
            </b-row>
          </div>
        </bit-crash-card>
      </div>
    </b-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import CrashButton from '@/components/ui/CrashButton.vue'
import titleMixin from '@/mixins/titleMixin'
import global from '@/mixins/global'
import message from '@/filters/message'
import { resetUserPassword } from '@/api/user'
export default {
  name: 'Home',
  title: 'Reset Password - Redexc',
  components: {
    BitCrashCard,
    CrashButton
    // MenuBar
  },
  mixins: [titleMixin, global],
  data() {
    return {
      user_new_password: '',
      user_new_password_confirm: '',
      pass_token: ''
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'wallet',
      'avatar',
      'crash_server_url',
      'user_id',
      'name',
      'token'
    ])
  },
  created() {
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.focus = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focus = false
      this.$emit('blur', event)
    },
    resetUserpasswordFunc() {
      if (this.user_new_password === '') {
        this.showToast('Error', message.profile_password_err_msg2, 'error')
        return
      }
      if (this.user_new_password_confirm === '' || this.user_new_password !== this.user_new_password_confirm) {
        this.showToast('Error', message.profile_password_err_msg3, 'error')
        return
      }
      const loader = this.showOverlay(null)
      this.pass_token = (this.$route.query.pass_token === undefined || this.$route.query.pass_token === null) ? '' : this.$route.query.pass_token
      resetUserPassword({ pass_token: this.pass_token, new_password: this.user_new_password }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.admin_reset_password_success, 'success')
          this.user_new_password_confirm = ''
          this.user_new_password = ''
          this.$router.push({ name: 'home' })
        } else {
          this.showToast('Error', response.message, 'error')
        }
        this.hideOverlay(loader)
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
        this.hideOverlay(loader)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.profile-security-button .button-row {
  display: flex;
  justify-content: center;
}
.profile-security-change-button {
  width: 200px !important;
}
.profile-title .label {
    font-weight: bold;
    color: #c9d6e4;
    font-size: 2rem;
    letter-spacing: .025em;
    line-height: 1.25;
}

.profile-sub-title .label {
    font-weight: bold;
    color: #ebf1f5;
    font-size: 1.125rem;
    letter-spacing: .025em;
    line-height: 1.25;
}
.profile-username {
  align-items: center;
}
.profile-desc {
  margin-top: 13.5px;
}
.profile-desc .label,
.profile-username .label
 {
  color: #c9d6e4;
  font-weight: 400;
  font-size: .9375rem;
  line-height: 1.5;
}

.seperator {
  height: 1px;
  background-color: $user-tbl-header-border-color;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 25px;
  margin-bottom: 25px;
  @include media-breakpoint-down(sm) {
    margin-left: 0px;
    margin-right: 0px;
  }
}
.profile-sub-title {
  margin-left: 30px;
  @include media-breakpoint-down(sm) {
    margin-left: 0px;
    margin-right: 0px;
  }
}

.bg {
  width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: 0px;
  background: #1e2742;
  border-radius: $control-border-radius;
  height: $crash-button-height;
  .text {
    font-size: 14px;
    color: #ffc206;
    border: none;
    background: none;
    width: 100%;
    margin-right: 10px;
    &:focus {
      outline-color: transparent;
    }
  }
  .profile-change-button {
    width: 100px;
  }
}

.root {
  position: relative;
  width: 100%;
}
.with-menu {
  @include media-breakpoint-down(md) {
    padding-left: 50px;
  }
  padding-left: calc(50px + #{$menu-width});
}
.m-t-30 {
  margin-top: 30px;
}
.m-t-15 {
  margin-top: 15px;
}
.m-b {
  margin-bottom: $normal-margin-bottom-lg;
}
.m-b-sm {
  margin-bottom: $normal-margin-bottom-sm;
}
.m-l {
  margin-left: 15px;
}
.w-h {
    width: 100%;
}

.bitcoin-card-content {
  padding-left: $deposit-card-padding-left-right;
  padding-right: $deposit-card-padding-left-right;
  padding-top: 30px;
  padding-bottom: 30px;
}
// responsive
.content-padding {
  padding-left: 50px;
  padding-top: 20px;
  padding-right: calc(50px + #{$chat-width} + #{$scrollbar-width});
  @include media-breakpoint-down(md) {
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-bottom: 50px;
}
@media (max-width: 991.98px) and (min-width: 321px)
{
  .content-padding {
    padding-right: 20px;
  }
}
@media (max-width: 1600px) and (min-width: 992px)
{
  .content-padding {
    padding-right: calc(50px + 300px + #{$scrollbar-width});
  }
}
</style>
