<template>
  <div class="root content-padding">
    <div class="referral-title">
      <div>
        <span style="margin-left: 10px">
          You referral link
        </span><br>
        <div class="bg-link flex-space-between-vc" style="margin-top: 10px">
          <input
            v-model="referralLink"
            class="text"
          >
          <div class="copy-btn">
            <round-button text="Copy" :icon="'link'" :color="'yellow'" :right-half="true" :transform="'left-10 rotate-45'" @click="referralCopy" />
          </div>
        </div>
        <b-row class="m-t-15">
          <b-col sm="12" md="6" lg="6" xl="6">
            <b-row>
              <pay-btn :type="'signup'" :value="referal_data.total_users" />
              <pay-btn :type="'success'" :value="success_refs" />
            </b-row>
          </b-col>
          <b-col sm="12" md="6" lg="6" xl="6">
            <social-sharing
              :url="referralLink"
              title="Redexc Referral Link"
              description="Redexc Referral Link"
              quote="Redexc Referral Link"
              hashtags="redexc,referrallink,referralcode"
              twitter-user="redexc"
              inline-template
            >
              <div>
                <network network="facebook">
                  <button
                    class="social_button"
                    style="width: 32%;
                    margin-right: 2%;
    background: #44619d;
    border: 0;
    padding: 10px;
    color: #fff;
    border-radius: 30px;"
                  >Facebook</button>
                </network>
                <network network="twitter">
                  <button
                    class="social_button"
                    style="width: 32%;
    background: rgb(29, 161, 242);
    border: 0;
    padding: 10px;
    color: #fff;
    border-radius: 30px;"
                  >Twitter</button>
                </network>
                <network network="whatsapp">
                  <button
                    class="social_button"
                    style="width: 32%;
    background: #1ebea5;
    margin-left: 2%;
    border: 0;
    padding: 10px;
    color: #fff;
    border-radius: 30px;"
                  >Whatsapp</button>
                </network>
              </div>
            </social-sharing>
          </b-col>
          <!--
          <b-col sm="4" md="2" lg="2" xl="2">
            <round-button text="Facebook" :icon="'facebook'" :color="'facebook'" />
          </b-col>
          <b-col sm="4" md="2" lg="2" xl="2">
            <round-button text="Twitter" :icon="'twitter'" :color="'twitter'" />
          </b-col>
          <b-col sm="4" md="2" lg="2" xl="2">
            <round-button text="Email" :icon="'email'" :color="'email'" />
          </b-col>
           -->
        </b-row>
      </div>
    </div>
    <b-row class="ml-1 top-bar" />
    <b-row align-v="start" class="top-content">
      <div class="w-h m-b-sm">
        <b-row>
          <b-col sm="12" md="4" lg="4" xl="4">
            <crash-button text="View Referral Earnings" @click="showReferal(null)" />
          </b-col>
        </b-row>
        <bit-crash-card :body-style="1" :no-header="false" class="m-t-30">
          <div slot="header" class="card-header flex-space-between-vc cashout-user">
            <span>
              Total number of referral users: {{ referal_data.total_users }}
            </span>
            <coin-label :bet="referralCode" />
          </div>
          <div class="card-content">
            <bit-crash-table :fields="tbl_fields" :items="referal_data.users" crash-type="1" size="lg" @click="showReferal" />
          </div>
        </bit-crash-card>
      </div>
    </b-row>
    <referral-modal :users="referal_data.users" :my-id="user_id" :user-id="selected_user_id" />
  </div>
</template>
<script>
import BitCrashTable from '@/components/crashTable/BitCrashTable.vue'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import PayBtn from '@/components/deposit/PayBtn'
import CrashButton from '@/components/ui/CrashButton.vue'
import RoundButton from '@/components/ui/RoundButton.vue'
import CoinLabel from '@/components/crashTable/CoinLabel.vue'
import ReferralModal from '@/components/user/ReferralModal.vue'
import { fetchList } from '@/api/user'
import { mapGetters } from 'vuex'
import { getReferralData } from '@/api/user'
import global from '@/mixins/global'
export default {
  components: {
    BitCrashTable,
    BitCrashCard,
    CrashButton,
    CoinLabel,
    RoundButton,
    ReferralModal,
    PayBtn
  },
  mixins: [global],
  data() {
    return {
      // refModalShow: false,
      user_id: 0,
      referralLink: '',
      selected_user_id: 0,
      referralCode: '',
      success_refs: 0,
      referal_data: {
        my_referral: '',
        users: [
        ],
        total_users: 0
      },
      tbl_fields: [
        {
          id: 1,
          label: 'No',
          type: 'plain',
          key: 'ID'
        },
        {
          id: 2,
          label: 'Referral User Avatar',
          type: 'profile',
          key: 'avatar'
        },
        {
          id: 3,
          label: 'Referral User name',
          type: 'plain',
          key: 'USERNAME'
        },
        {
          id: 4,
          label: 'Method',
          type: 'link',
          key: 'view_earnings'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.$store.dispatch('user/getInfo', this.token)
      .then((res) => {
        this.user_id = res.ID
        this.success_refs = res.success_referrals
        getReferralData({ user_id: res.ID }).then(response => {
          this.referralCode = response.data.referral_code
          this.referralLink = 'https://bitcrash.co.za/#/home?r=' + this.referralCode
          this.getUserList()
        })
      })
  },
  created() {
  },
  methods: {
    showReferal(user_item) {
      this.selected_user_id = user_item == null ? this.user_id : user_item.ID
      // this.refModalShow = true
      this.$bvModal.show('referral-modal')
    },
    referralCopy() {
      var self = this
      this.$copyText(this.referralLink).then(function(e) {
        self.showToast('Success', 'The referral link has been copied to the clipboard.', 'success')
      }, function(e) {
        self.showToast('Error', 'Can not copy to the clipboard.', 'error')
      })
    },
    getUserList() {
      fetchList({ limit: 999999, referralCode: this.referralCode }).then(response => {
        this.referal_data.users = response.data.items
        this.referal_data.total_users = response.data.total
      })
    }
    // refModalVisibleChanged(state) {
    //   if (this.refModalShow != state) {
    //     this.refModalShow = state
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
button:hover{
  opacity: .8;
}
.root {
  color: #ffffff;
}
.bg-link {
  width: 100%;
  padding-left: $control-padding-left-right;
  background: #2d3a5f;
  border-radius: $round-border-radius;
  .text {
    font-size: 14px;
    color: #ffc206;
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

.card-content {
  padding: 1vw;
  @include media-breakpoint-down(sm) {
    padding: 20px;
  }
  height: 100%;
}

.description {
    color: $navbar-profile-text-color;
    font-size: 14px;
}

.top-content {
    width: 100%;
    padding-top: 60px;
    background: -webkit-radial-gradient(circle, #28375e, #1e2843, #1e2843); /* Safari */
    background: -o-radial-gradient(circle, #28375e, #1e2843, #1e2843); /* Opera 11.6 to 12.0 */
    background: -moz-radial-gradient(circle, #28375e, #1e2843, #1e2843); /* Firefox 3.6 to 15 */
    background: radial-gradient(circle, #28375e, #1e2843, #1e2843); /* Standard syntax */
}

.top-bar {
  margin-top: 24px;
  height: 1px;
  width: 100%;
  background: -webkit-radial-gradient(circle, #3c4b7c, #1e2843, #1e2843); /* Safari */
  background: -o-radial-gradient(circle, #3c4b7c, #1e2843, #1e2843); /* Opera 11.6 to 12.0 */
  background: -moz-radial-gradient(circle, #3c4b7c, #1e2843, #1e2843); /* Firefox 3.6 to 15 */
  background: radial-gradient(circle, #3c4b7c, #1e2843, #1e2843); /* Standard syntax */
}

.withdraw-title .label {
    font-weight: bold;
    color: #c9d6e4;
    font-size: 2rem;
    letter-spacing: .025em;
    line-height: 1.25;
}

.cashout-user {
  background: linear-gradient(90deg, #20be82, #14a092);
  color: #fff;
}

.withdraw-desc {
  margin-top: 13.5px;
}
.bit-crash-table-wrapper .bit-crash-table thead th {
  padding: 20px
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
