export default {
  methods: {
    showToast(title, message, type) {
      if (type === 'error') {
        this.$toast.error({
          title: title,
          message: message,
          position: 'top right',
          type: type,
          progressBar: true,
          color: '#BE2739',
          showDuration: 5000,
          hideDuration: 7000
        })
      } else {
        this.$toast.success({
          title: title,
          message: message,
          position: 'top right',
          type: type,
          progressBar: true,
          color: '#51A351',
          showDuration: 5000,
          hideDuration: 7000
        })
      }
    },
    showOverlay(container) {
      const loader = this.$loading.show({
        container: container,
        canCancel: false,
        loader: 'bars',
        color: '#3f48cc'
      })
      return loader
    },
    hideOverlay(loader) {
      loader.hide()
    }
  }
}
