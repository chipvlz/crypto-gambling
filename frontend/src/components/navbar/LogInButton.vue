<template>
  <div class="root">
    <div class="bg flex-row-hc-vc" :class="{'is-medium': size }" @click="btnClick">
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LogInButton',
  components: {
  },
  props: {
    text: {
      type: String,
      default: 'LogIn'
    },
    size: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    btnClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.root {
  padding-left: 10px;
  padding-right: 10px;
}
.bg {
  cursor: pointer;
  height: 42px;
//   width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: $control-padding-left-right;
  background: $main-bg-color;
  border-radius: $control-border-radius;
//   box-shadow: $crash-box-shadow;
  text-align: center;
  &:hover {
    background: #2b375e;
  }
  .text {
    font-size: $control-label-text-size;
    color: white;
    font-weight: bold;
  }
}
.is-medium {
  height: 40px !important;
}
</style>
