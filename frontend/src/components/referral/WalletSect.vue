<template>
  <div class="level-balance ml-5" :class="customStyle">
    <span style="vertical-align: center;">{{ text }}</span>
    <div v-if="type=='user'" class="flex-row-hl-vc mt-4">
      <img src="@/assets/img/ic_user.png" width="25px">
      <span class="label ml-2">0</span>
    </div>
    <div v-if="type=='bet'" class="flex-row-hl-vc mt-4">
      <img src="@/assets/img/ic_bets.png" width="25px">
      <span class="label ml-2">0</span>
    </div>
    <div v-if="type=='income'" class="flex-row-hl-vc mt-4">
      <img src="@/assets/img/ic_income.png" width="25px">
      <span class="label ml-2">0</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletSect',
  props: {
    type: {
      type: String,
      default: 'user'
    }
  },
  computed: {
    customStyle: {
      get() {
        var ret = this.type === 'income' ? 'no-border' : ''
        return ret
      }
    },
    text: {
      get() {
        switch (this.type) {
          case 'user':
            return 'Deposit'
          case 'bet':
            return 'Bets'
          case 'income':
            return 'Your income'
          default:
            return ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/_variables.scss";
  .level-balance {
    border-right: 1px solid #485992;
    padding-right: 102px;
  }
  .no-border {
    border: none;
  }
</style>
