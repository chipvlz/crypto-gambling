function isIE() {
  const msie = navigator.userAgent.indexOf('MSIE ')
  return msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)
}

function isEdge() {
  return /Edge/.test(navigator.userAgent)
}

export default {
  methods: {
    login() {
      this.$bvModal.show('login-form')
    },
    signup() {
      this.$bvModal.show('signup-form')
    },
    contactUs(submit) {
      if (!submit) {
        this.$bvModal.show('contact-form')
      } else {
        this.$emit('submitted')
      }
    },
    scrollTo(sectionId) {
      const top = document.getElementById(sectionId).offsetTop - 51

      if (isIE()) {
        window.scrollTo(0, top)
      } else if (isEdge()) {
        window.scroll(0, top)
      } else {
        window.scroll({
          top,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
