<template>
  <div class="bit-crash-card" :class="customStyle">
    <div v-if="$slots.header || header" class="bit-crash-header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div :class="contentStyle">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'BitCrashCard',
  components: {
    // BitCrashTable,
    // CoinLabel,
  },
  props: {
    header: {
      type: String,
      default: ''
    },
    bodyStyle: {
      type: Number,
      default: 0
    },
    shadow: {
      type: Boolean,
      default: true
    },
    hoverBorder: {
      type: Boolean,
      default: false
    },
    noHeader: {
      type: Boolean,
      default: false
    },
    cardType: {
      type: String,
      default: '0'
    }
  },
  computed: {
    customStyle: {
      get() {
        var ret = this.shadow ? 'is-shadow' : 'is-none-shadow'
        ret += this.hoverBorder ? ' hover-bordered' : ''
        return ret
      }
    },
    contentStyle: {
      get() {
        var ret = ''
        if (this.cardType === '1') { ret = 'bit-log-content' } else if (this.cardType === '2') { ret = 'bit-allbet-content' } else { ret = 'bit-crash-content' }
        ret += this.shadow ? ' is-shadow' : ' is-none-shadow'
        ret += this.bodyStyle === 0 ? ' normal-content' : ' special-content'
        ret += !this.noHeader ? '' : ' top-left-border-radius'
        return ret
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
  .bit-crash-card {
    position: relative;
    border-radius: $card-border-radius;
    .bit-crash-content{
      border-bottom-left-radius: $card-border-radius;
      border-bottom-right-radius: $card-border-radius;
      width: 100%;
      height: 100%;
    }
    .bit-allbet-content {
      border-bottom-left-radius: $card-border-radius;
      border-bottom-right-radius: $card-border-radius;
      width: 100%;
      overflow-y: auto;
      max-height: 400px;
      @include media-breakpoint-down(sm) {
        max-height: 300px;
        margin-bottom: 13.5px;
      }
    }
    .bit-log-content {
      border-bottom-left-radius: $card-border-radius;
      border-bottom-right-radius: $card-border-radius;
      width: 100%; overflow-y: auto;
      max-height: 200px;
      @include media-breakpoint-down(sm) {
        max-height: 300px;
      }
    }
    .normal-content {
      background-color: $crash-header-bg-color;
    }
    .special-content {
      background: #ffffff;
    }
  }
  .is-shadow {
    box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  }
  .is-none-shadow {
  }
  .top-left-border-radius {
    border-top-left-radius: $card-border-radius;
    border-top-right-radius: $card-border-radius;
  }
  .hover-bordered {
    border-color: transparent;
    border-style: solid;
    border-width: 1px;
    .bit-crash-content{
      border-top-left-radius: $card-border-radius;
      border-top-right-radius: $card-border-radius;
      overflow-y: auto;
      overflow-y: auto;
      max-height: 400px;

    }
    .bit-allbet-content {
      border-bottom-left-radius: $card-border-radius;
      border-bottom-right-radius: $card-border-radius;
      width: 100%;
      overflow-y: auto;
      max-height: 400px;
    }
    &:hover {
      border-color: #62a1fe;
    }
  }
</style>
