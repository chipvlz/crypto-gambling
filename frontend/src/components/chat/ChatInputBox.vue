<template>
  <div class="bg flex-space-between-vc" style="">
    <input
      v-model="currentValue"
      class="text flex1"
      name="quantity"
      :placeholder="placeholderString"
      :disabled="disabled"
      :readonly="readonly"
      @keyup.enter="sendMsg"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    >
    <crash-button :icon="text.length > 0 ? '' : 'paper-plane'" :disabled="disabled" :text="text" @click="sendMsg" />
  </div>
</template>

<script>
import CrashButton from '@/components/ui/CrashButton'
import global from '@/mixins/global'

export default {
  name: 'CrashBetButton',
  components: {
    CrashButton
  },
  mixins: [global],
  props: {
    value: {
      type: String,
      default: function() {
        return ''
      }
      // [String, Number]
    },
    disabled: Boolean,
    readonly: Boolean,
    text: {
      type: String,
      default: ''
    },
    inputtype: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      currentValue: this.value,
      focus: false,
      placeholderString: ''
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    }
  },
  created() {
    if (this.inputtype === '0') { this.placeholderString = 'Type your message' }
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.focus = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focus = false
      this.$emit('blur', event)
    },
    sendMsg() {
      if (this.inputtype === '0') {
        if (this.currentValue !== '') {
          this.$emit('sendMsg', this.currentValue)
          this.currentValue = ''
        }
      } else {
        var self = this
        this.$copyText(this.currentValue).then(function(e) {
          self.showToast('Success', 'Okay great stuff, your Redexc BTC wallet address has been copied to the clipboard.', 'success')
        }, function(e) {
          self.showToast('Error', 'Can not copy to the clipboard', 'error')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.caption {
  font-size: $control-label-text-size;
  color: $navbar-text-color;
  font-weight: bold;
  margin-bottom: 5px;
}
.bg {
  width: 100%;
  padding-left: $control-padding-left-right;
  background: #1e2742;
  border-radius: $control-border-radius;

  .text {
    font-size: 13px;
    color: white;
    border: none;
    background: none;
    width: 100%;
    margin-right: 10px;
    &:focus {
      outline-color: transparent;
    }
  }
  .sup {
    font-size: 18px;
    color: $control-sup-text-color;
    font-weight: bold;
  }
}
</style>
