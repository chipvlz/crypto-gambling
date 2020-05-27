<template>
  <b-modal
    id="login-form"
    centered
    hide-footer
    modal-class="login-signup-form"
    header-class="border-bottom-0"
  >
    <h2>{{ step === 1?'LogIn':'Forgot your password?' }}</h2>
    <form ref="loginForm">
      <b-form-group v-if="step === 1" label="UserName / Email" label-for="form-username-email">
        <b-form-input id="form-username-email" v-model="form.username_email" placeholder="Your name or email here" />
      </b-form-group>
      <b-form-group v-if="step === 2" label="Enter your email address to reset your password." label-for="form-username-email">
        <b-form-input id="form-username-email" v-model="form.username_email" placeholder="Your email here" />
      </b-form-group>
      <b-form-group v-if="step === 1" label="Password" label-for="form-password">
        <b-form-input id="form-password" v-model="form.password" type="password" placeholder="Your password here" />
      </b-form-group>
      <log-in-button :text="step === 1 ? 'LogIn' : 'Submit'" @click="step === 1 ? onLogIn() :forgotPasswordFunc()" />
      <b-form-group v-if="step === 1" label="" class="text-center" label-for="forgot-password">
        <a href="#" @click="forgotStep">Forgot Password?</a>
      </b-form-group>
    </form>
  </b-modal>
</template>
<script>
// import ContactButton from '@/components/ContactButton.vue'
import LogInButton from '@/components/navbar/LogInButton'
import global from '@/mixins/global'
import message from '@/filters/message.js'
import { forgotUserPassword } from '@/api/user'
export default {
  components: {
    LogInButton
  },
  mixins: [global],
  data() {
    return {
      form: {
        username_email: '',
        password: ''
      },
      step: 1
    }
  },
  methods: {
    forgotStep() {
      this.step = 2
    },
    forgotPasswordFunc() {
      if (this.form.username_email === '') {
        this.showToast('Error', message.forgot_password_required, 'error')
        return
      }
      forgotUserPassword({ email: this.form.username_email }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', response.message, 'success')
          this.step = 1
        } else {
          this.showToast('Error', response.message, 'error')
        }
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
      })
    },
    onLogIn() {
      var valid = true
      if (valid) {
        const loader = this.showOverlay(null)
        this.loading = true
        this.form['token'] = ''
        this.$store
          .dispatch('user/login', this.form)
          .then((response) => {
            if (response.code === 20000) {
              this.$store.dispatch('user/getInfo', this.token)
              this.loading = false
              this.$bvModal.hide('login-form')

              this.$toast.success({
                title: 'Login Success',
                message: message.login_success_msg,
                position: 'top right',
                type: 'success',
                progressBar: true,
                color: '#51A351',
                showDuration: 4000,
                hideDuration: 6000
              })
            } else {
              this.$toast.error({
                title: 'Login Failed',
                message: response.message,
                position: 'top right',
                type: 'error',
                progressBar: true,
                color: '#BE2739',
                showDuration: 4000,
                hideDuration: 6000
              })
            }
            this.hideOverlay(loader)
          })
          .catch((err) => {
            this.$toast.error({
              title: 'Login Failed',
              message: err,
              position: 'top right',
              type: 'error',
              progressBar: true,
              color: '#BE2739',
              showDuration: 4000,
              hideDuration: 6000
            })
            loader.hide()
            this.hideOverlay(loader)
            this.loading = false
          })
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

