<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center profile-title">
              <b-col class="label">
                My Profile Settings
              </b-col>
            </b-row>
            <b-row class="text-center profile-desc">
              <b-col class="label">
                If you have not setup your avatar, you'll see a default one. Upload your picture to make it your avatar.
              </b-col>
            </b-row>
            <b-row class="profile-avatar-img m-t-30 text-center">
              <b-col>
                <v-lazy-image v-if="data_loaded" :src="user_avatar" class="image-avatar" />
              </b-col>
            </b-row>
            <b-row class="profile-avatar-button m-t-15">
              <b-col>
                <crash-button id="pick-avatar" text="Change" class="profile-image-change-button" />
              </b-col>
            </b-row>
            <avatar-cropper
              trigger="#pick-avatar"
              :upload-url="image_upload_url"
              :labels="labels"
              @uploading="handleUploading"
              @uploaded="handleUploaded"
              @completed="handleCompleted"
              @error="handlerError"
            />
            <b-row class="seperator" />
            <b-row class="profile-sub-title">
              <b-col class="label">
                User Information
              </b-col>
            </b-row>
            <b-row class="profile-username m-t-30">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="2" sm="2" class="label">User name:</b-col>
              <b-col xl="4" lg="5" md="6" sm="8" class="bg flex-space-between-vc">
                <input
                  v-model="user_name"
                  class="text"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @input="handleInput"
                >
                <crash-button text="Change" class="profile-change-button" @click="usernameChange" />
              </b-col>
            </b-row>
            <b-row class="profile-username m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="2" sm="2" class="label">User email:</b-col>
              <b-col xl="4" lg="5" md="6" sm="8" class="bg flex-space-between-vc">
                <input
                  v-model="user_email"
                  class="text"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @input="handleInput"
                >
                <crash-button text="Change" class="profile-change-button" @click="useremailChange" />
              </b-col>
            </b-row>
            <b-row class="seperator m-t-30" />
            <b-row class="profile-sub-title">
              <b-col class="label">
                Overview
              </b-col>
            </b-row>
            <b-row class="profile-overview m-t-30">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="3" sm="3" cols="6" class="label">Joined:</b-col>
              <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="label">{{ join_time }}</b-col>
            </b-row>
            <b-row class="profile-overview m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="3" sm="3" cols="6" class="label">Deposits:</b-col>
              <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="label">{{ deposit_sum }} coins</b-col>
            </b-row>
            <b-row class="profile-overview m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="3" sm="3" cols="6" class="label">Withdrawals:</b-col>
              <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="label">{{ withdraw_sum }} coins</b-col>
            </b-row>
            <b-row class="profile-overview m-t-15">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="3" sm="3" cols="6" class="label">Balance:</b-col>
              <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="label">{{ balance }} coins</b-col>
            </b-row>

            <b-row class="seperator m-t-30" />
            <b-row class="profile-sub-title">
              <b-col class="label">
                Security
              </b-col>
            </b-row>
            <b-row class="profile-username m-t-30">
              <b-col xl="2" lg="1" md="1" sm="1" class="label" />
              <b-col xl="2" lg="3" md="2" sm="2" class="label">Old password:</b-col>
              <b-col xl="4" lg="5" md="6" sm="8" class="bg flex-space-between-vc">
                <input
                  v-model="user_old_password"
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
                <crash-button text="Change" class="profile-security-change-button" @click="updateUserpassword" />
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
import config from '@/config'
import { getProfilePageData, updateUsername, updateUseremail, updatePassword, updateAvatar } from '@/api/user'
import { getDateFormat, getNumberFormat } from '@/utils/index'
import AvatarCropper from 'vue-avatar-cropper'
export default {
  name: 'Home',
  title: 'Profile - Redexc',
  components: {
    BitCrashCard,
    CrashButton,
    AvatarCropper
  },
  mixins: [titleMixin, global],
  data() {
    return {
      data_loaded: false,
      user_name: '',
      user_email: '',
      user_old_password: '',
      user_new_password: '',
      user_new_password_confirm: '',
      withdraw_sum: 0,
      deposit_sum: 0,
      user_avatar: '',
      balance: 0,
      join_time: 0,
      labels: {
        submit: 'submit',
        cancel: 'cancel'
      },
      imageUploading: false,
      image_loader: null,
      image_upload_url: ''
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
    this.image_upload_url = config.base_domain + ':' + config.main_port + '/api/user/upload_avatar'

    this.$store.dispatch('user/getInfo', this.token)
      .then((res) => {
        getProfilePageData({ user_id: this.user_id }).then(response => {
          if (response.status === 'success') {
            this.user_name = response.data.user_name
            this.user_email = response.data.email
            this.withdraw_sum = getNumberFormat(response.data.withdraw_sum)
            this.deposit_sum = getNumberFormat(response.data.deposit_sum)
            this.balance = getNumberFormat(response.data.wallet)
            this.user_avatar = response.data.avatar
            this.join_time = getDateFormat(parseInt(response.data.join_time))
            this.data_loaded = true
          } else {
            this.showToast('Error', response.message, 'error')
          }
        })
          .catch(() => {
            this.showToast('Error', message.disconnect_err_msg1, 'error')
          })
      })
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
    handleUploading(form, xhr) {
      if (!this.imageUploading) {
        this.imageUploading = true
        this.image_loader = this.showOverlay(null)
      }
    },
    handleUploaded(response) {
      if (response.status === 'success') {
        this.user_avatar = response.data.avatar
        updateAvatar({ user_id: this.user_id, avatar: response.data.avatar }).then(response => {
          if (response.status === 'success') {
            this.showToast('Success', message.profile_avatar_change_success, 'success')
            this.$store.dispatch('user/getInfo', this.token)
          } else {
            this.showToast('Error', response.message, 'error')
          }
          this.hideOverlay(this.image_loader)
          this.imageUploading = false
        }).catch(() => {
          this.showToast('Error', message.disconnect_err_msg1, 'error')
          this.hideOverlay(this.image_loader)
          this.imageUploading = false
        })
      } else {
        this.showToast('Error', response.message, 'error')
      }
    },
    handleCompleted(response, form, xhr) {
    },
    handlerError(message, type, xhr) {
      this.showToast('Error', message, 'error')
    },
    usernameChange() {
      if (this.user_name === '') {
        this.showToast('Error', message.signup_failed_msg1, 'error')
        return
      }
      const loader = this.showOverlay(null)
      updateUsername({ user_id: this.user_id, username: this.user_name }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.profile_username_change_success, 'success')
          this.$store.dispatch('user/getInfo', this.token)
        } else {
          this.showToast('Error', response.message, 'error')
        }
        this.hideOverlay(loader)
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
        this.hideOverlay(loader)
      })
    },
    useremailChange() {
      if (this.user_email === '') {
        this.showToast('Error', message.signup_failed_msg2, 'error')
        return
      }
      const loader = this.showOverlay(null)
      updateUseremail({ user_id: this.user_id, useremail: this.user_email }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.profile_useremail_change_success, 'success')
          this.$store.dispatch('user/getInfo', this.token)
        } else {
          this.showToast('Error', response.message, 'error')
        }
        this.hideOverlay(loader)
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
        this.hideOverlay(loader)
      })
    },
    updateUserpassword() {
      if (this.user_old_password === '') {
        this.showToast('Error', message.profile_password_err_msg1, 'error')
        return
      }
      if (this.user_new_password === '') {
        this.showToast('Error', message.profile_password_err_msg2, 'error')
        return
      }
      if (this.user_new_password_confirm === '' || this.user_new_password !== this.user_new_password_confirm) {
        this.showToast('Error', message.profile_password_err_msg3, 'error')
        return
      }
      const loader = this.showOverlay(null)
      updatePassword({ user_id: this.user_id, old_password: this.user_old_password, new_password: this.user_new_password }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.profile_password_change_success, 'success')
          this.user_new_password_confirm = ''
          this.user_new_password = ''
          this.user_old_password = ''
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
.profile-avatar-button .col {
  display: flex;
  justify-content: center;
}
.profile-image-change-button {
  width: 150px !important;
}
.image-avatar {
  height: 150px;
  width: 150px;
}
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

.profile-desc {
  margin-top: 13.5px;
}
.profile-desc .label,
.profile-username .label,
.profile-overview .label
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

.profile-username {
  align-items: center;
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
