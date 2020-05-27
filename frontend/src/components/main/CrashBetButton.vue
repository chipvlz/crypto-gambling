<template>
  <div
    class="bg flex-space-between-vc"
    :class="[margin==='1'?'m26':'' , isDisabled?'disabled':'' , background]"
    @click="click"
  >
    <span class="text" :class="'text-' + size">{{ text }}</span>
    <img src="@/assets/img/ic_bet.png">
  </div>
</template>

<script>

export default {
  name: 'CrashBetButton',
  components: {
  },
  props: {
    margin: {
      type: String,
      default: '0'
    },
    text: {
      type: String,
      default: 'BET'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    },
    background: {
      type: String,
      default: ''
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.bg {
  cursor: pointer;
  height: $control-height;
  width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: $control-padding-left-right;
  background: linear-gradient(90deg, #42a5f5 , #1976d2 );
  border-radius: $control-border-radius;
  box-shadow: $crash-box-shadow;
  &:hover {
    background: linear-gradient(90deg, #64b5f6 , #2196f3 );
  }
  .text {
    color: white;
  }
  .text-small {
    font-size: 14px;
  }
  .text-normal {
    font-size: 18px;
    font-weight: bold;
  }
  &.disabled {
    background: linear-gradient(90deg, #9e9e9e  , #616161  );
    &:hover {
      background: linear-gradient(90deg, #757575  , #424242  );
    }
  }
  @media (min-width: 1700px)
  {
    .text-large {
      font-size: 24px;
      font-weight: bold;
    }
  }
  @media (min-width: 1500px) and (max-width: 1700px)
  {
    .text-large {
      font-size: 20px;
      font-weight: bold;
    }
  }
  @media (min-width: 1310px) and (max-width: 1500px)
  {
    .text-large {
      font-size: 18px;
      font-weight: bold;
    }
  }
  @media (min-width: 1120px) and (max-width: 1310px)
  {
    .text-large {
      font-size: 16px;
      font-weight: bold;
    }
  }
  @media (min-width: 768px) and (max-width: 1120px)
  {
   .text-large {
      font-size: 14px;
      font-weight: bold;
    }
  }
  @media (max-width: 768px)
  {
   .text-large {
      font-size: 24px;
      font-weight: bold;
    }
  }
}
.betting_bg {
  background: linear-gradient(90deg, #1fbd82, #14a191);
}
.betting_bg:hover {
  background: linear-gradient(90deg, #1fbd82, #14a191);
}
.cancel_bg {
  background: linear-gradient(90deg, #6e7371, #454c4c);
}
.cancel_bg:hover {
  background: linear-gradient(90deg, #5a5f5d, #353a3a) !important;
}
.cashout_bg {
  background: linear-gradient(90deg, #05adf6, #1c8bcf);
}
.cashout_bg:hover {
  background: linear-gradient(90deg, #0d9ddc, #1c7fbb) !important;
}
.m26 {
  margin-bottom: 13.5px;
}
</style>
