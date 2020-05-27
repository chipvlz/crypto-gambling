<template>
  <div class="root">
    <div class="bg flex-row-hc-vc" :class="{ 'disabled' : disabled, 'non-disabled' : !disabled, 'right-half': rightHalf }" @click="btnClick">
      <font-awesome-icon v-if="icon != ''" :icon="icon" />
      <span v-if="text != ''" class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CrashButton',
  components: {
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rightHalf: {
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
  min-width: 60px;
}
.bg {
  padding-left: $crash-button-padding-left-right;
  padding-right: $crash-button-padding-left-right;
  padding-top: $crash-button-padding-top-bottom;
  padding-bottom: $crash-button-padding-top-bottom;

  cursor: pointer;
  height: $crash-button-height;
  border-radius: $control-border-radius;
  text-align: center;

  .text {
    font-size: $control-label-text-size;
    font-weight: bold;
  }
}
.disabled {
  background: #46568c !important;
  color: #6f7ba4;
  &:hover {
    background: #46568c !important;
  }
}
.non-disabled {
  background: linear-gradient(90deg,#5356fe, #62a2fe);
  box-shadow: $crash-box-shadow;
  color: white;
  &:hover {
    background: linear-gradient(90deg,#4245c9, #4f82c9);
  }
}
</style>
