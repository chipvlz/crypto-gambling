<template>
  <b-modal
    id="signup-form"
    centered
    hide-footer
    modal-class="login-signup-form"
    header-class="border-bottom-0"
  >

    <h2>SignUp</h2>

    <form>
      <b-form-group label="UserName" label-for="form-username">
        <b-form-input id="form-username" v-model="form.username" placeholder="Your name here" />
      </b-form-group>
      <b-form-group label="Email" label-for="form-email">
        <b-form-input id="form-email" v-model="form.email" type="email" placeholder="Your email here" />
      </b-form-group>
      <b-form-group label="Password" label-for="form-password">
        <b-form-input id="form-password" v-model="form.password" type="password" placeholder="Your password here" />
      </b-form-group>
      <b-form-group label="Password Confirm" label-for="form-password-confirm">
        <b-form-input id="form-password-confirm" v-model="form.password_confirm" type="password" placeholder="Type your password again" />
      </b-form-group>
      <!-- <b-form-group label="Referral" label-for="form-referral">
        <b-form-input id="form-referral" v-model="form.referral_code_p" placeholder="Your referral here" />
      </b-form-group> -->
      <b-form-checkbox-group class="form-group">
        <b-form-checkbox id="form-agree" v-model="form.agree">I agree to the terms of service</b-form-checkbox>
      </b-form-checkbox-group>
      <log-in-button text="SignUp" @click="onSignup" />
    </form>
  </b-modal>
</template>

<script>
// import ContactButton from '@/components/ContactButton.vue';
import LogInButton from '@/components/navbar/LogInButton'
import { signup } from '@/api/user'
import global from '@/mixins/global'
import message from '@/filters/message'
export default {
  components: {
    LogInButton
  },
  mixins: [global],
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        agree: false,
        referral_code_p: ''
      }
    }
  },
  created() {
  },
  mounted() {
    if (this.$route.query.r !== undefined && this.$route.query.r !== '') {
      this.form.referral_code_p = this.$route.query.r
    }
  },
  methods: {
    isValid() {
      if (this.form.username === undefined || this.form.username == null || this.form.username.length <= 0) {
        this.showToast('Signup Failed', message.signup_failed_msg1, 'error')
        return false
      }
      if (this.form.email === undefined || this.form.email == null || this.form.email.length <= 0) {
        this.showToast('Signup Failed', message.signup_failed_msg2, 'error')
        return false
      }
      if (this.form.password === undefined || this.form.password == null || this.form.password.length <= 0) {
        this.showToast('Signup Failed', message.signup_failed_msg3, 'error')
        return false
      }
      if (this.form.password_confirm === undefined || this.form.password_confirm == null || this.form.password_confirm.length <= 0) {
        this.showToast('Signup Failed', message.signup_failed_msg4, 'error')
        return false
      }
      if (this.form.password_confirm !== this.form.password) {
        this.showToast('Signup Failed', message.signup_failed_msg5, 'error')
        return false
      }
      if (this.form.agree === undefined || this.form.agree == null || this.form.agree === false) {
        this.showToast('Signup Failed', message.signup_failed_msg6, 'error')
        return false
      }
      return true
    },
    onSignup() {
      // this.referral_code_p = this.$route.query.r
      var valid = this.isValid()
      if (valid) {
        this.loading = true
        var data = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          referral_code_p: this.form.referral_code_p || '2'
        }
        const loader = this.showOverlay(null)
        signup(data).then(response => {
          if (response.code !== 20000) {
            this.hideOverlay(loader)
            this.showToast('Signup Failed', response.message, 'error')
            // Error
          } else {
            this.$store
              .dispatch('user/login', { token: response.data.token })
              .then(() => {
                // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.$store.dispatch('user/getInfo', this.token)
                this.$bvModal.hide('signup-form')
                this.hideOverlay(loader)
                this.showToast('Signup Success', 'You just signed up successfully.', 'success')
              })
              .catch(() => {
                this.hideOverlay(loader)
              })
          }
        })
          .catch(() => {
            this.showToast('Error', message.disconnect_err_msg1, 'error')
            this.hideOverlay(loader)
          })
      } else {
        return false
      }
    }
  }
}
</script>
