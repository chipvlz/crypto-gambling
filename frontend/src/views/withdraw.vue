<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center withdraw-title">
              <b-col class="label">
                Withdraw Bitcoin
              </b-col>
            </b-row>
            <b-row class="text-center withdraw-desc">
              <b-col class="label">
                You can send withdrawal request with your address and amount.
                Each request will take transaction fee.
              </b-col>
            </b-row>
            <b-row class="withdraw-bitcoin">
              <b-col sm="12" md="4" lg="4" xl="4" class="m-t-30">
                <div class="withdraw-available-account">
                  <b-row class="label text-center">
                    AVAILABLE BTC BALANCES
                  </b-row>
                  <b-row class="label m-t-15">
                    <b-col cols="6">BTC</b-col>
                    <b-col cols="6">{{ available_wallet_btc }}</b-col>
                  </b-row>
                  <b-row class="label m-t-15">
                    <b-col cols="6">Coins</b-col>
                    <b-col cols="6">{{ available_wallet_coins }}</b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col sm="12" md="8" lg="8" xl="8" class="withdraw-bitcoin-panel">
                <b-row class="withdraw-address m-t-30">
                  <b-col cols="12" sm="4" md="4" lg="4" xl="4" class="label">
                    Address
                  </b-col>
                  <b-col cols="12" sm="8" md="8" lg="8" xl="8">
                    <crash-edit
                      v-model="withdraw_address"
                      class="withdraw-address-input"
                      type="2"
                    />
                  </b-col>
                </b-row>
                <b-row class="withdraw-amount m-t-30">
                  <b-col cols="12" sm="4" md="4" lg="4" xl="4" class="label">
                    Amount
                  </b-col>
                  <b-col cols="12" sm="8" md="8" lg="8" xl="8" class="line-container">
                    <crash-edit
                      v-model="withdraw_coins"
                      class="withdraw-coin"
                      sup="Coin"
                      type="2"
                    />
                    <div class="text-center label">
                      =
                    </div>
                    <crash-edit
                      v-model="withdraw_btc"
                      class="withdraw-btc"
                      sup="BTC"
                      type="2"
                    />
                  </b-col>
                </b-row>
                <b-row class="withdraw-fee m-t-30">
                  <b-col cols="4" sm="4" md="4" lg="4" xl="4" class="label">
                    Tx Fee
                  </b-col>
                  <b-col cols="8" sm="8" md="8" lg="8" xl="8" class="withdraw-fee-value">
                    {{ withdraw_fee_btc }} BTC
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="withdraw-button m-t-30" style="justify-content: center;">
              <b-col cols="9" sm="6" md="5" lg="5" xl="3">
                <crash-button text="Request Withdrawal" @click="withdrawRequest" />
              </b-col>
            </b-row>
          </div>
        </bit-crash-card>
      </div>
    </b-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import CrashEdit from '@/components/main/CrashEdit.vue'
import CrashButton from '@/components/ui/CrashButton.vue'
import titleMixin from '@/mixins/titleMixin'
import global from '@/mixins/global'
import message from '@/filters/message'
import { getWithdrawPageData } from '@/api/user'
import { requestWithdraw } from '@/api/bitcoin'

export default {
  name: 'Home',
  title: 'Withdraw - Redexc',
  components: {
    CrashEdit,
    CrashButton,
    BitCrashCard
  },
  mixins: [titleMixin, global],
  data() {
    return {
      withdraw_coins: 0,
      withdraw_btc: 0,
      withdraw_fee: 0,
      withdraw_fee_btc: 0,
      withdraw_address: '',
      available_wallet_btc: 0,
      available_wallet_coins: 0
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'wallet',
      'avatar',
      'crash_server_url',
      'user_id',
      'name',
      'token'
    ])
  },
  watch: {
    withdraw_coins: function(val) {
      if (isNaN(parseFloat(val / 1000000))) {
        this.withdraw_btc = 0
        this.withdraw_fee_btc = 0
      } else {
        this.withdraw_btc = parseFloat(val / 1000000)
        this.withdraw_fee_btc = parseFloat(this.withdraw_btc * this.withdraw_fee / 100).toFixed(8)
      }
    },
    withdraw_btc: function(val) {
      if (isNaN(parseInt(val * 1000000))) {
        this.withdraw_coins = 0
        this.withdraw_fee_btc = 0
      } else {
        this.withdraw_coins = parseInt(val * 1000000)
        this.withdraw_fee_btc = parseFloat(this.withdraw_btc * this.withdraw_fee / 100).toFixed(8)
      }
    }
  },
  created: function() {
    getWithdrawPageData({ user_id: this.user_id }).then(response => {
      if (response.status === 'success') {
        this.available_wallet_coins = response.data.wallet
        this.available_wallet_btc = parseFloat(this.available_wallet_coins / Math.pow(10, 6)).toFixed(6)
        this.withdraw_fee = response.data.withdraw_fee
      } else {
        this.showToast('Error', response.message, 'error')
      }
    })
      .catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
      })
  },
  methods: {
    withdrawRequest() {
      if (this.withdraw_coins > this.available_wallet_coins) {
        this.showToast('Error', message.coinslack_msg, 'error')
        return
      }
      if (this.withdraw_address === '') {
        this.showToast('Error', message.withdraw_address_err_msg, 'error')
        return
      }
      if (this.withdraw_coins === 0) {
        this.showToast('Error', message.withdraw_amount_err_msg, 'error')
        return
      }
      requestWithdraw({ who: this.user_id, to_address: this.withdraw_address, amount: this.withdraw_btc }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.withdraw_request_success, 'success')
          this.withdraw_coins = 0
          this.withdraw_btc = 0
          this.withdraw_fee = 0
          this.withdraw_address = ''
          this.$store.dispatch('user/getInfo', this.token)
        } else {
          this.showToast('Error', response.message, 'error')
        }
      })
        .catch(() => {
          this.showToast('Error', message.disconnect_err_msg1, 'error')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.withdraw-title .label {
    font-weight: bold;
    color: #c9d6e4;
    font-size: 2rem;
    letter-spacing: .025em;
    line-height: 1.25;
}

.withdraw-desc {
  margin-top: 13.5px;
}

.withdraw-desc .label
 {
  color: #c9d6e4;
  font-weight: 400;
  font-size: .9375rem;
  line-height: 1.5;
}

.withdraw-address .label,
.withdraw-amount .label,
.withdraw-fee .label {
  color: #c9d6e4;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  text-align: right;
}
.withdraw-fee-value {
  color: #c9d6e4;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5;
}
.withdraw-available-account .label {
  color: #c9d6e4;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
}
.withdraw-address,
.withdraw-amount,
.withdraw-fee {
  align-items: center;
}

.withdraw-amount .line-container {
  flex-direction: row;
  display: flex;
  align-items: center;
}

.withdraw-amount .line-container .label {
  width: 30px;
}

.withdraw-coin ,
.withdraw-btc {
    width: calc(50% - 15px);
}

.withdraw-available-account {
  background: #1b2132;
  padding: 15px 30px 15px 30px;
  border-radius: 10px;
}
.withdraw-bitcoin {
  flex-direction: row-reverse;
}

.root {
  position: relative;
  width: 100%;
}

.m-t-15 {
  margin-top: 15px;
}
.m-t-30 {
  margin-top: 30px;
}

.m-b {
  margin-bottom: $normal-margin-bottom-lg;
}
.m-b-sm {
  margin-bottom: $normal-margin-bottom-sm;
}
.m-l {
  margin-left: 15px;
}
.w-h {
    width: 100%;
}

.bitcoin-card-content {
  padding-left: $deposit-card-padding-left-right;
  padding-right: $deposit-card-padding-left-right;
  padding-top: 30px;
  padding-bottom: 30px;
}

// responsive
.content-padding {
  padding-left: 50px;
  padding-top: 20px;
  padding-right: calc(50px + #{$chat-width} + #{$scrollbar-width});
  @include media-breakpoint-down(md) {
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-bottom: 50px;
}
@media (max-width: 991.98px) and (min-width: 321px)
{
  .content-padding {
    padding-right: 20px;
  }
}
@media (max-width: 1600px) and (min-width: 992px)
{
  .content-padding {
    padding-right: calc(50px + 300px + #{$scrollbar-width});
  }
}
</style>
