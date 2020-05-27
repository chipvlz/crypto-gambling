<template>
  <div>
    <bit-crash-card>
      <div slot="header" class="card-header">
        <div class="flex-space-between-vc" style="overflow: hidden">
          <crash-header-item v-for="element in headerList" :key="element.id" :data="element" />
        </div>
      </div>
      <div class="card-content">
        <b-row>
          <b-col sm="12" md="4" lg="4" xl="4" class="m-b">
            <crash-edit v-model="bet_input" label="BET" sup="BTC" />
          </b-col>
          <b-col sm="12" md="4" lg="4" xl="4" class="m-b">
            <crash-edit v-model="auto_cashout" label="AUTO CASHOUT" sup="X" />
          </b-col>
          <b-col sm="12" md="4" lg="4" xl="4">
            <crash-bet-button :is-disabled="!is_logged_in" :text="state=='started' ? 'Cancel' : 'BET'" @click="betClick" />
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12" md="8" lg="8" xl="8">
            <crash-scale-item @click="scaleItemClick" />
          </b-col>
          <b-col sm="12" md="4" lg="4" xl="4">
            <crash-bet-select />
          </b-col>
        </b-row>
      </div>
    </bit-crash-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import CrashHeaderItem from '@/components/main/CrashHeaderItem.vue'
import CrashBetButton from '@/components/main/CrashBetButton.vue'
import CrashBetSelect from '@/components/main/CrashBetSelect.vue'
import CrashEdit from '@/components/main/CrashEdit.vue'
import CrashScaleItem from '@/components/main/CrashScaleItem.vue'

export default {
  name: 'Crash',
  components: {
    BitCrashCard,
    CrashHeaderItem,
    CrashBetButton,
    CrashBetSelect,
    CrashEdit,
    CrashScaleItem
  },
  data() {
    return {
      headerList: [
        {
          id: 0,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: true
        },
        {
          id: 1,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: false
        },
        {
          id: 2,
          scale: 1.5,
          val: 978513,
          type: 1,
          is_active: false
        },
        {
          id: 3,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: false
        },
        {
          id: 4,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: false
        },
        {
          id: 5,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: false
        }
      ],
      state: 'waiting', // there are three status, WAITING, STARTED, CRASHED
      bet_temp: 0, // for temporary save -- when game started, and you bet your bet is store in this variable
      bet_amount: 0, // real betting amount  when state becomes waiting, bet_amount = bet_temp and bet_temp becomes 0
      bet_input: 0,
      auto_cashout: 0,
      auto_bet: false,

      current_users: [],
      cashout_list: [],

      game_id: 0,

      timeLeft: 5000,
      on_win: {
        return_base: true,
        increase_amount: 100
      },
      on_lose: {
        return_base: true,
        increase_amount: 100
      },
      timerHandler: 0
    }
  },
  computed: {
    ...mapGetters(['is_logged_in', 'wallet', 'avatar']),
    betting_time: function() {
      return Math.floor(this.timeLeft / 100) / 10
    },
    bet_sum: function() {
      var sum = 0
      for (var i = 0; i < this.current_users.length; i += 1) {
        sum += this.current_users[i].bet * 1
      }

      return sum
    },
    cashout_sum: function() {
      var sum = 0
      for (var i = 0; i < this.cashout_list.length; i += 1) {
        sum += this.cashout_list[i].bet * this.cashout_list[i].option / 100
      }

      return sum
    }
  },
  methods: {
    betClick() {},
    scaleItemClick(item) {
      if (this.bet_amount == null) {
        this.bet_amount = 0
      }
      switch (item.id) {
        case 0:
          this.bet_amount = 0
          break
        case 1:
          this.bet_amount += 10
          break
        case 2:
          this.bet_amount += 100
          break
        case 3:
          this.bet_amount += 250
          break
        case 4:
          this.bet_amount += 1000
          break
        case 5:
          this.bet_amount = Math.trunc(this.bet_amount / 2)
          break
        case 6:
          this.bet_amount = Math.trunc(this.bet_amount * 2)
          break
        case 7:
          this.bet_amount = this.wallet
          break
        default:
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";

.card-header {
  //min-height: $card-header-height;
  background: $crash-header-bg-color;
  padding: 1vw;
  @include media-breakpoint-down(sm) {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 15px;
      padding-top: 15px;
   }
}
.m-b {
  margin-bottom: $normal-margin-bottom-sm;
}
</style>
