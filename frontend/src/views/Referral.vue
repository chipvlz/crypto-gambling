<template>
  <div class="root content-padding main-content">
    <div>
      <h3>Referral</h3>
      <span class="description">Invite your friends and earn money</span>
    </div>
    <b-row class="ml-1 top-bar" />
    <b-row class="ml-1 top-content m-b">
      <b-col sm="12" md="6" lg="6" xl="4" class="manual">
        <img src="@/assets/img/referral_1.png">
        <div class="p-15">
          <span>1</span><br>
          <span>Share your referral link or code</span><br>
          <span class="description">Everyone who registers through your link or uses your code becomes your referral. The Code will give your referrals + {{ referralValue }}% on their first deposit.</span>
        </div>
      </b-col>
      <b-col sm="12" md="6" lg="6" xl="4" class="manual">
        <div class="position:relative;">
          <img src="@/assets/img/referral_2.png">
          <span v-if="referralValue > 0" class="referral_2_profit">{{ referralValue }}%</span>
        </div>
        <div class="p-15">
          <span>2</span><br>
          <span>Earn Money and Rank Points</span><br>
          <span class="description">You will get up to {{ referralValue }}% of our revenue(House Edge) from bets placed by your referrals and Rank Points equal to their first deposit.</span>
        </div>
      </b-col>
      <b-col sm="12" md="6" lg="6" xl="4" class="manual">
        <img src="@/assets/img/referral_3.png">
        <div class="p-15">
          <span>3</span><br>
          <span>Use earned money for betting or withdrawal</span><br>
          <span class="description">Simple, isn't it? if you need any help, contact our support.</span>
        </div>
      </b-col>
    </b-row>
    <b-row class="ml-1 w-100 m-b">
      <b-col sm="12" md="12" lg="12" xl="12">
        <bit-crash-card :body-style="1" :no-header="true" class="link-content">
          <b-row>
            <b-col sm="12" md="6" lg="6" xl="6">
              <div class="card-content">
                <span>
                  You referral link
                </span><br>
                <div class="bg flex-space-between-vc" style="margin-top: 10px">
                  <input
                    v-model="referralLink"
                    class="text"
                    readonly
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @input="handleInput"
                  >
                  <crash-button text="Copy" @click="referralCopy" />
                </div>
              </div>
            </b-col>
            <b-col sm="12" md="6" lg="6" xl="6">
              <div class="card-content">
                <span>
                  You referral code
                </span><br>
                <div class="bg flex-space-between-vc" style="margin-top: 10px">
                  <input
                    v-model="referralCode"
                    class="text"
                    readonly
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @input="handleInput"
                  >
                  <crash-button text="Change" :disabled="true" />
                </div>
                <br>
                <span class="description">
                  New users will get <span class="referral_pros">+{{ referralValue }}%</span> bonus on their first deposit for using your code.
                </span>
              </div>
            </b-col>
          </b-row>
        </bit-crash-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import CrashButton from '@/components/ui/CrashButton.vue'
import { getReferralData } from '@/api/user'
import global from '@/mixins/global'
// import BitCrashTable from '@/components/crashTable/BitCrashTable.vue'
// import LevelSilver from '@/components/referral/LevelSilver.vue'
// import WalletSect from '@/components/referral/WalletSect.vue'
export default {
  name: 'Referral',
  components: {
    BitCrashCard,
    CrashButton
    //    BitCrashTable,
    //    LevelSilver,
    //    WalletSect
  },
  mixins: [global],
  data() {
    return {
      referralLink: '',
      referralCode: '',
      referralValue: 0,
      focus: false,
      title_tbl_fields: [
        {
          id: 1,
          label: 'Level',
          type: 'text',
          key: 'level'
        },
        {
          id: 2,
          label: 'Unique depositors(Active)',
          type: 'text',
          key: 'type'
        },
        {
          id: 3,
          label: '-or-',
          type: 'text',
          key: 'or'
        },
        {
          id: 4,
          label: 'Monthly win/loss',
          type: 'text',
          key: 'win'
        },
        {
          id: 5,
          label: 'Your Commision(of hours edge)',
          type: 'text',
          key: 'profit'
        }
      ],
      title_tbl_items: [
        {
          level: 'Silver', type: '0-100', or: '', win: '100k', profit: '10%'
        },
        {
          level: 'Silver', type: '0-100', or: '', win: '100k', profit: '10%'
        },
        {
          level: 'Silver', type: '0-100', or: '', win: '100k', profit: '10%'
        }
      ]
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
    ]),
    option_types: {
      get() {
        return ['user', 'bet', 'income']
      }
    }
  },
  created: function() {
    this.$store.dispatch('user/getInfo', this.token)
      .then((res) => {
        getReferralData({ user_id: this.user_id }).then(response => {
          this.referralLink = response.data.referral_link
          this.referralCode = response.data.referral_code
          this.referralValue = response.data.referral_value
        })
      })
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
    referralCopy() {
      var self = this
      this.$copyText(this.referralLink).then(function(e) {
        self.showToast('Success', 'The referral link has been copied to the clipboard.', 'success')
      }, function(e) {
        self.showToast('Error', 'Can not copy to the clipboard.', 'error')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.root {
  position: relative;
}
.main-content {
  width: 100%;
  color: #ffffff;

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
  .subtitle {
    color: #c9d6e4;
  }
  .referral_pros {
    color: white;
    font-weight: bold;
  }
}
.card-content {
  padding: 35px;
  width: 100%;
}
.card-header {
  background: linear-gradient(90deg, #28335e, #28335e);
}
.link-content {
  width: 100%;
}
.manual {
  text-align: center;
}
.p-15 {
  padding: 15px;
}

.bg {
  width: 100%;
  padding-left: $control-padding-left-right;
  background: #1e2742;
  border-radius: $control-border-radius;

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

.nav-tabs .nav-link.active {
  color: white;
  background: transparent;
  border: none;
  border-bottom: 2px solid #62a0fe;
}

.nav-tabs .nav-link {
  color: white;
  border: none;
  border-bottom: 1px solid #485992;
  & :hover {
    border: none;
  }
}
.m-b {
  margin-bottom: $normal-margin-bottom-lg;
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
    padding-right: calc(20px + 300px + #{$scrollbar-width});
  }
}
.referral_2_profit {
  position: absolute;
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: 0.2rem;
  color: #c9d6e4;
}
@media (max-width: 1200px)
{
  .referral_2_profit {
    left: 32%;
    top: 15%;
  }
}
@media (min-width: 1200px)
{
  .referral_2_profit {
    left: 32%;
    top: 15%;
  }
}

</style>
