<template>
  <div class="deposit-btn-root">
    <div class="bg flex-row-hl-vc" :class="bodyStyle" @click="btnClick">
      <img v-if="type == 'deposit'" src="@/assets/img/ic_deposit.png">
      <img v-if="type == 'withdraw'" src="@/assets/img/ic_withdraw.png">
      <div class="seperator" />
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DepositBtn',
  components: {
  },
  props: {
    type: {
      type: String,
      default: 'deposit'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bodyStyle: {
      get() {
        var ret = ''
        ret += this.disabled ? 'disabled' : 'non-disabled'
        ret += (this.type === 'deposit' ? ' deposit-btn' : ' withdraw-btn')
        return ret
      }
    },
    text: {
      get() {
        return this.type === 'deposit' ? 'deposit' : 'withdraw'
      }
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
.deposit-btn-root {
  min-width: 60px;
}
.bg {
  padding: 7px;

  cursor: pointer;
  height: $crash-button-height;
  border-radius: $navbar-profile-border-radius;
  text-align: center;

  .seperator {
    background-color: #bed8ff;
    width: 1px;
    height: 100%;
    margin-left: 7px;
    margin-right: 7px;
  }
  .text {
    overflow: hidden;
    font-size: $control-label-text-size;
    font-weight: bold;
    text-transform: uppercase;
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
  color: white;
  &:hover {
  }
}
.deposit-btn {
  background: #62a1fe;
  &:hover {
    background: #4f80c9;
  }
}
.withdraw-btn {
  box-shadow: $crash-box-shadow;
  background: linear-gradient(90deg,#5356fe, #62a2fe);
  &:hover {
    background: linear-gradient(90deg,#4245c9, #4f82c9);
  }
}
</style>
