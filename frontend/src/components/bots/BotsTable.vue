<template>
  <div>
    <bit-crash-card class="bots-table-card" card-type="1">
      <div slot="header" class="card-header flex-space-between-vc all-bets">
        <span>
          {{ items.length }} {{ type==0? 'in Game' : 'Cashed out' }}
        </span>
        <coin-label :bet="sum" />
      </div>
      <div class="card-content">
        <bit-crash-table :fields="fields" :items="items" crash-type="1" />
      </div>
    </bit-crash-card>
  </div>
</template>

<script>
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import BitCrashTable from '@/components/crashTable/BitCrashTable.vue'
import CoinLabel from '@/components/crashTable/CoinLabel.vue'
import { getNumberFormat } from '@/utils/index'

export default {
  name: 'BotsTable',
  components: {
    BitCrashCard,
    BitCrashTable,
    CoinLabel
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    fields: {
      type: Array,
      default: function() {
        return []
      }
    },
    items: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    sum: function() {
      var sum = 0
      for (var i = 0; i < this.items.length; i += 1) {
        sum += this.items[i].bet * (this.type === 0 ? 1 : (this.items[i].option === undefined ? 1 : this.items[i].option / 100))
      }

      return getNumberFormat(sum)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.bots-table-card {
  max-height: calc(80% - #{$normal-margin-bottom})
}
.card-header {
  //height: $card-header-height;
  //height: 3vw;
  padding: 0.7vw 1vw 0.7vw 1vw;
  color: $primary;
  font-size: 14px;
  font-weight: bold;
  @include media-breakpoint-down(sm) {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 15px;
      padding-top: 15px;
      height: $card-header-height;
  }

}
.card-content {
  padding: 1vw;
  @include media-breakpoint-down(sm) {
    padding: 20px;
  }
  height: 100%;
}
.progress-user {
  background: linear-gradient(90deg, #04aef7, #1c8ace);
}
.cashout-user {
  background: linear-gradient(90deg, #20be82, #14a092);
}
</style>
