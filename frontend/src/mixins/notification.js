import { isWithdrawRequest } from '@/api/bitcoin'
import message from '@/filters/message'
export default {
  created() {
    // alert('sadf')
    /* var self = this
    setInterval(() => {
      self.check()
    }, 60000) */
  },
  methods: {
    check() {
      isWithdrawRequest({}).then(response => {
        if (response.status === 'success' && response.data) {
          this.showNotification('Notification', message.withdrawCheck, 'success')
        }
      })
        .catch(() => {
          this.showNotification('Error', message.disconnect_err_msg1, 'error')
        })
    },
    showNotification(title, message, type) {
      if (type === 'error') {
        this.$toast.error({
          title: title,
          message: message,
          position: 'top right',
          type: type,
          progressBar: true,
          color: '#BE2739',
          showDuration: 7000,
          hideDuration: 13000
        })
      } else {
        this.$toast.success({
          title: title,
          message: message,
          position: 'top right',
          type: type,
          progressBar: true,
          color: '#51A351',
          showDuration: 7000,
          hideDuration: 13000
        })
      }
    }
  }
}
