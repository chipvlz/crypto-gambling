<template>
  <div :class="{ 'root right-half': rightHalf , 'root': !rightHalf }">
    <div v-if="color != ''" class="bg flex-row-hc-vc" :class="color" @click="btnClick">
      <font-awesome-icon v-if="icon != ''" :icon="icon" :flip="'both'" :transform="transform" />
      <span v-if="text != ''" class="text">{{ text }}</span>
    </div>
    <div v-else class="bg flex-row-hc-vc" :class="{ 'disabled' : disabled, 'non-disabled' : !disabled }" @click="btnClick">
      <font-awesome-icon v-if="icon != ''" :icon="icon" :flip="'both'" :transform="transform" />
      <span v-if="text != ''" class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RoundButton',
  components: {
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    transform: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
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
  border-radius: $round-border-radius;
  text-align: center;
  .text {
    font-size: $control-label-text-size;
    font-weight: bold;
  }
  &:hover {
    opacity: .8;
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
.right-half {
  .bg {
    border-radius: 0 25px 25px 0;
  }
}
.yellow {
  background: #ffa001;
}
.white {
  background: #fff;
  color: #000;
}
.facebook {
  background: #345d9f;
}
.twitter {
  background: #25b0f5;
}
.email {
  background: #007db9;
}
</style>
