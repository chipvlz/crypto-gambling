<template>
  <mdb-container fluid>
    <mdb-row align-v="start" class="flex1 content-padding">
      <mdb-col sm="12" md="8" lg="8" xl="8" class="p-none p-l">
        <bit-crash-card class="m-b" style="position:relative;">
          <div slot="header" class="card-header all-bets">
            <!-- <font-awesome-icon id="history_info" :icon="['fa', 'info-circle']" />
            <b-tooltip target="history_info" triggers="hover">
              Game History <br>
              click on a game that has ended to view more info
            </b-tooltip>
            <mdb-row align-v="center">
              <mdb-col v-for="element in headerList" :key="element.id" class="c_col2" style="padding-left: 0px !important; padding-right: 0px !important;">
                <div>
                  <crash-header-item :data="element" />
                </div>
              </mdb-col>
            </mdb-row> -->
            <span>
              Graph
            </span>
          </div>
          <div class="card-content">
            <mdb-row>
              <crash-graph :event-bus="eventBus" @interface="getTick" />
            </mdb-row>
            <!-- <mdb-row class="betting-row">
              <mdb-col v-if="!auto_bet" sm="12" md="8" lg="8" xl="8">
                <crash-scale-item @click="scaleItemClick" />
              </mdb-col>
              <mdb-col v-if="auto_bet" sm="12" md="4" lg="4" xl="4">
                <crash-edit v-model="auto_bet_stop_amount" label="Stop if bet is >" sup="Clear" type="1" :disabled="!is_logged_in" />
              </mdb-col>
              <mdb-col v-if="auto_bet" sm="12" md="4" lg="4" xl="4">
                <crash-edit v-model="auto_bet_session_profit" label="Session Profit" type="2" disabled />
              </mdb-col>
              <mdb-col sm="12" md="4" lg="4" xl="4">
                <crash-bet-select
                  :active-item="auto_bet?1:0"
                  :isbusy="(auto_betting && auto_bet) || (!auto_bet && (bet_amount > 0 || bet_temp > 0))"
                  @click="betTypeClick"
                />
              </mdb-col>
            </mdb-row> -->
            <mdb-row class="betting-row m-t">
              <mdb-col v-if="auto_bet" sm="12" md="6" lg="6" xl="6">
                <crash-auto-win-loss
                  v-model="auto_bet_win_increase_value"
                  :active-item="auto_bet_win_increase_by?1:0"
                  :disabled="auto_bet_win_increase_by?false:true"
                  label="On Win"
                  dropdown-id="crashBetDropdown1"
                  classify="win"
                  @click="autoWinClick"
                />
              </mdb-col>
              <mdb-col v-if="auto_bet" sm="12" md="6" lg="6" xl="6">
                <crash-auto-win-loss
                  v-model="auto_bet_loss_increase_value"
                  :active-item="auto_bet_loss_increase_by?1:0"
                  :disabled="auto_bet_loss_increase_by?false:true"
                  label="On Loss"
                  dropdown-id="crashBetDropdown2"
                  classify="loss"
                  @click="autoLossClick"
                />
              </mdb-col>
            </mdb-row>
          </div>
        </bit-crash-card>
        <bit-crash-card card-type="2" class="d-block d-sm-none">
          <div slot="header" class="card-header all-bets">
            <span>Bet</span>
          </div>
          <div class="card-content">
            <mdb-row class="betting-row">
              <mdb-col sm="12" md="12" lg="12" xl="12" class="12">
                <crash-edit v-if="!auto_bet" v-model="bet_input" label="Your bet" sup="Clear" type="1" :disabled="!is_logged_in" />
                <crash-edit v-if="auto_bet" v-model="bet_input" label="Base bet" sup="Clear" type="1" :disabled="!is_logged_in" />
              </mdb-col>
              <mdb-col sm="12" md="12" lg="12" xl="12" class="m-b">
                <crash-edit v-model="auto_cashout" label="Auto-cashout" sup="X" type="2" :disabled="!is_logged_in" />
              </mdb-col>
              <mdb-col sm="12" md="12" lg="12" xl="12">
                <crash-bet-button
                  :is-disabled="!is_logged_in"
                  :text="betBtnText"
                  :size="betBtnSize"
                  :background="betBtnBackground"
                  margin="1"
                  @click="do_action"
                />
              </mdb-col>
            </mdb-row>
          </div>
        </bit-crash-card>
        <bit-crash-card card-type="2">
          <div slot="header" class="card-header flex-space-between-vc all-bets">
            <span>
              All Bets
            </span>
          </div>
          <div class="card-content">
            <bit-crash-table :fields="all_tbl_fields" :items="all_tbl_items" />
          </div>
        </bit-crash-card>
      </mdb-col>
      <mdb-col sm="12" md="4" lg="4" xl="4" class="bots-table-wrapper p-none m-b">
        <bit-crash-card card-type="2" class="d-none d-sm-block">
          <div slot="header" class="card-header all-bets">
            <span>Bet</span>
          </div>
          <div class="card-content">
            <mdb-row class="betting-row">
              <mdb-col sm="12" md="12" lg="12" xl="12" class="12">
                <crash-edit v-if="!auto_bet" v-model="bet_input" label="Your bet" sup="Clear" type="1" :disabled="!is_logged_in" />
                <crash-edit v-if="auto_bet" v-model="bet_input" label="Base bet" sup="Clear" type="1" :disabled="!is_logged_in" />
              </mdb-col>
              <mdb-col sm="12" md="12" lg="12" xl="12" class="m-b">
                <crash-edit v-model="auto_cashout" label="Auto-cashout" sup="X" type="2" :disabled="!is_logged_in" />
              </mdb-col>
              <mdb-col sm="12" md="12" lg="12" xl="12">
                <crash-bet-button
                  :is-disabled="!is_logged_in"
                  :text="betBtnText"
                  :size="betBtnSize"
                  :background="betBtnBackground"
                  margin="1"
                  @click="do_action"
                />
              </mdb-col>
            </mdb-row>
          </div>
        </bit-crash-card>
        <bots-table :type="0" :fields="bots_tbl_fields" :items="current_users" class="mt-4 bots-table m-b" />
        <bots-table :type="1" :fields="bots_cashout_tbl_fields" :items="cashout_list" class="bots-table" />
      </mdb-col>
    </mdb-row>
  </mdb-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BotsTable from '@/components/bots/BotsTable.vue'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import BitCrashTable from '@/components/crashTable/BitCrashTable.vue'
// import CrashHeaderItem from '@/components/main/CrashHeaderItem.vue'
import CrashBetButton from '@/components/main/CrashBetButton.vue'
// import CrashBetSelect from '@/components/main/CrashBetSelect.vue'
import CrashEdit from '@/components/main/CrashEdit.vue'
// import CrashScaleItem from '@/components/main/CrashScaleItem.vue'
import CrashGraph from '@/components/main/CrashGraph.vue'
import CrashAutoWinLoss from '@/components/main/CrashAutoWinLoss.vue'
import io from 'socket.io-client/dist/socket.io.js'
import { getNumberFormat, getFloat2Decimal } from '@/utils'
import { game_log } from '@/api/crash'
import titleMixin from '@/mixins/titleMixin'
import global from '@/mixins/global'
import message from '@/filters/message'
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue'

export default {
  name: 'Home',
  title: '',
  components: {
    BotsTable,
    BitCrashCard,
    BitCrashTable,
    // CrashHeaderItem,
    CrashBetButton,
    // CrashBetSelect,
    CrashEdit,
    // CrashScaleItem,
    CrashGraph,
    CrashAutoWinLoss,
    mdbContainer,
    mdbRow,
    mdbCol
  },
  mixins: [titleMixin, global],
  data() {
    return {
      bots_tbl_fields: [
        {
          id: 1,
          label: 'User Name',
          type: 'profile',
          key: 'show_user'
        },
        {
          id: 2,
          label: 'Bet Amount',
          type: 'bet',
          key: 'bet'
        }
      ],
      bots_cashout_tbl_fields: [
        {
          id: 1,
          label: 'Username',
          type: 'profile',
          key: 'show_user'
        },
        {
          id: 2,
          label: '@',
          type: 'text',
          key: 'cashout'
        },
        {
          id: 3,
          label: 'Profit',
          type: 'text',
          key: 'profit'
        }
      ],
      all_tbl_fields: [
        {
          id: 1,
          label: 'User',
          type: 'profile',
          key: 'user'
        },
        {
          id: 2,
          label: '@',
          type: 'text',
          key: 'cashout'
        },
        {
          id: 3,
          label: 'My Bet',
          type: 'text',
          key: 'bet'
        },
        {
          id: 4,
          label: 'Bonus',
          type: 'text',
          key: 'bonus'
        },
        {
          id: 5,
          label: 'Profit',
          type: 'text',
          key: 'profit'
        }
      ],
      all_tbl_items: [
      ],
      headerList: [
      ],
      interval: 10,
      betBtnText: 'BET',
      betBtnSize: 'large',
      betBtnBackground: '',
      state: 'waiting', // there are three status, WAITING, STARTED, CRASHED
      bet_temp: 0, // for temporary save -- when game started, and you bet your bet is store in this variable
      bet_amount: 0, // real betting amount  when state becomes waiting, bet_amount = bet_temp and bet_temp becomes 0
      tick: 0, // this is server tick
      client_tick: 0, // this is client tick which is calculated in client side
      prev_tick: 0,
      time_stamp: 0,
      bet_input: 0,
      auto_cashout: 0,
      auto_cashout_server: 0, // Auto Cashout Server Value

      auto_bet: false,
      auto_bet_session_profit: 'Autobet off',
      auto_bet_stop_amount: 0,
      auto_bet_win_increase_by: false,
      auto_bet_loss_increase_by: false,
      auto_bet_win_increase_value: 0,
      auto_bet_loss_increase_value: 0,

      auto_betting: false,

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
      timerHandler: 0,
      crash_socket: null,
      eventBus: {}
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'wallet',
      'wallet_btc',
      'avatar',
      'crash_server_url',
      'user_id',
      'name',
      'token'
    ]),
    betting_time: function() {
      return Math.floor(this.timeLeft / 100) / 10
    }
  },
  watch: {
    current_users: {
      deep: true,
      handler(val) {
        var temp = val
        for (var i = 0; i < temp.length; i++) {
          temp[i]['show_user'] = {
            name: temp[i]['name'],
            url:
              temp[i]['avatar'] === undefined ||
              temp[i]['avatar'] === null
                ? ''
                : temp[i]['avatar']
          }
          temp[i]['id'] = temp[i]['user_id']
        }
        this.updateAllBets()
      }
    },
    cashout_list: {
      deep: true,
      handler(val) {
        var temp = val
        for (var i = 0; i < temp.length; i++) {
          temp[i]['show_user'] = {
            name: temp[i]['name'],
            url:
              temp[i]['avatar'] === undefined ||
              temp[i]['avatar'] === null
                ? ''
                : temp[i]['avatar']
          }
          temp[i]['id'] = temp[i]['user_id']
        }
        this.updateAllBets()
      }
    }
  },
  mounted() {
  },
  created: function() {
    var self = this
    this.crash_socket = io.connect(this.crash_server_url)
    this.crash_socket.emit('onMessage', {
      code: 'Reload',
      username: this.name
    })
    // socket reference
    this.crash_socket.on('onMessage', function(data) {
      switch (data.code) {
        case 'GameRule': // i don't know what to do here ...
          break
        case 'ReloadPlayers':
          self.reload(data)
          break
        case 'WaitGame':
          // game-created
          self.sendEvent('game-created', { duration: 0 })
          self.on_wait(data)
          break
        case 'GameStart':
          // emit game-started
          self.start(data)
          break
        case 'Tick':
          // from server
          if (Date.now() - self.time_stamp > 500) {
            self.time_stamp = Date.now()
          }
          self.do_tick(data.tick)
          break
        case 'GameCrash':
          // game finished
          self.crash(data)
          break
        case 'GameStartCrash':
          data.finish = 1
          self.start(data)
          self.sendEvent('game-finished', { crash: data.crash })
          self.close_timer()
          self.state = 'CRASHED'
          self.tick = data.crash
          self.update_btn()
          break
        case 'BetResult':
          if (data.status) {
            // update_wallet()
            self.$store.dispatch('user/getInfo', self.token)
          } else {
            self.showToast('Error', data.error, 'error')
          }
          break
        case 'Cashout':
          // the result of cashout
          if (data.status) {
            // update_wallet()
            if (data.type === 'auto') {
              self.bet_amount = 0
              if (self.auto_betting) { self.auto_bet_session_profit += data.profit }
              self.update_btn()
            }
            self.$store.dispatch('user/getInfo', self.token)
          } else {
            self.showToast('Error', data.error, 'error')
          }
          break
        case 'AutoBetStop':
          self.auto_betting = false
          self.auto_bet = true
          self.betBtnText = 'AUTO BET'
          self.betBtnBackground = ''
          self.auto_bet_session_profit = 'Autobet off'
          break
        case 'RestoreBetType':
          if (!data.autoBetting) {
            self.auto_bet = false
            self.auto_betting = false
          } else {
            self.auto_bet = true
            self.auto_betting = true
            self.bet_input = data.base_amount
            self.auto_cashout = data.auto_cashout
            self.auto_bet_stop_amount = data.stop_bet_amount
            if (self.auto_betting) { self.auto_bet_session_profit = data.session_profit }
            self.auto_bet_win_increase_by = data.on_win_increase_by
            self.auto_bet_win_increase_value = data.on_win_increase_by_amount
            self.auto_bet_loss_increase_by = data.on_loss_increase_by
            self.auto_bet_loss_increase_value = data.on_loss_increase_by_amount
            self.betBtnText = 'STOP AUTOBET'
            self.betBtnBackground = 'cashout_bg'
          }
          break
        case 'UpdateWallet':
          if (self.user_id === data.who) {
            self.showToast('Success', 'Your payment is completed successfully!', 'success')
            self.$store.dispatch('user/getInfo', self.token)
          }
          break
        default:
          break
      }
    })

    this.crash_socket.on('disconnect', function() {
      // stop game
      self.stop()
      self.showToast('Error', message.disconnect_err_msg, 'error')
    })
    this.updateHistory(null)
  },
  methods: {
    getTick(event) {
      this.client_tick = event
      if (this.client_tick !== this.prev_tick) {
        this.update_btn()
        this.prev_tick = this.client_tick
      }
    },
    scaleItemClick(item) {
      if (this.bet_input == null) {
        this.bet_input = 0
      }
      this.bet_input = parseFloat(this.bet_input)
      switch (item.id) {
        case 0:
          this.bet_input = 1000
          break
        case 1:
          this.bet_input += 10
          break
        case 2:
          this.bet_input += 100
          break
        case 3:
          this.bet_input += 250
          break
        case 4:
          this.bet_input += 1000
          break
        case 5:
          this.bet_input = Math.trunc(this.bet_input / 2)
          break
        case 6:
          this.bet_input = Math.trunc(this.bet_input * 2)
          break
        case 7:
          this.bet_input = this.wallet
          break
        default:
      }
    },
    betTypeClick(id) {
      // when change another bet method , we should check if prev-method is free
      if (id === 0) {
        this.auto_bet = false
        this.betBtnText = 'BET'
      } else {
        this.auto_bet = true
        this.betBtnText = 'AUTO BET'
      }
    },
    autoWinClick(id) {
      if (id === 0) {
        this.auto_bet_win_increase_by = false
      } else {
        this.auto_bet_win_increase_by = true
      }
    },
    autoLossClick(id) {
      if (id === 0) {
        this.auto_bet_loss_increase_by = false
      } else {
        this.auto_bet_loss_increase_by = true
      }
    },
    updateHistory(data) {
      let limitVal = 6
      if (window.innerWidth > 1310 && window.innerWidth <= 1700) {
        limitVal = 8
      }
      game_log({ limit: limitVal }).then(response => {
        this.headerList = []
        const { data } = response
        for (var i = 0; i < data.length; i++) {
          this.headerList.push(
            {
              id: data[i].GAMENO,
              scale: getFloat2Decimal(data[i].BUST / 100),
              val: data[i].GAMENO,
              type: 0,
              is_active: true
            }
          )
        }
      })
    },
    do_action() {
      // when you are not logged in, betting button is not working.
      if (!this.is_logged_in) {
        this.showToast('Error', message.bet_err_msg1, 'error')
        return
      }
      if (!this.auto_bet) {
        if (this.bet_temp > 0) {
          // cancel betting when graph is drawing  (betting is for next round)
          this.bet_temp = 0
        } else if (this.bet_amount > 0) {
          if (this.state === 'WAITING') return // when waiting status, you can do nothing but bet...
          if (this.state === 'STARTED') { // you can bet now (bet_amount > 0)
            if (this.crash_socket != null) {
              this.crash_socket.emit('onMessage', {
                code: 'CashOut',
                user_id: this.user_id,
                game_id: this.game_id,
                stopped_at: this.client_tick
              })
              this.bet_amount = 0
            }
          }
        } else {
          // place bet
          var t_bet = parseInt(this.bet_input)
          if (isNaN(t_bet) || t_bet === 0) {
            this.showToast('Error', 'Please input correct number.', 'error')
            return
          }
          if (t_bet > this.wallet) {
            this.showToast('Error', message.wallet_err_msg, 'error')
            return
          }
          if (this.state === 'WAITING') {
            this.bet_amount = t_bet
            this.do_bet()
          } else {
            // when it's after started, then ...
            this.bet_temp = t_bet
          }
        }
        this.update_btn()
      } else {
        this.auto_betting = !this.auto_betting
        var tt_bet = parseInt(this.bet_input)
        if (isNaN(tt_bet) || tt_bet === 0) {
          this.showToast('Error', 'Please input correct number.', 'error')
          return
        }

        if (this.auto_betting) {
          if (this.crash_socket != null) {
            this.crash_socket.emit('onMessage', {
              code: 'AutoBet',
              user_id: this.user_id,
              user_name: this.name,
              base_amount: tt_bet,
              auto_cashout: (this.auto_cashout === undefined || this.auto_cashout === null || isNaN(parseFloat(this.auto_cashout)) || parseFloat(this.auto_cashout) < 1 ? 0 : parseFloat(this.auto_cashout)),
              stop_bet_amount: (this.auto_bet_stop_amount === undefined || this.auto_bet_stop_amount === null || isNaN(parseFloat(this.auto_bet_stop_amount)) ? 0 : parseFloat(this.auto_bet_stop_amount)),
              session_profit: (isNaN(parseInt(this.auto_bet_session_profit)) ? 0 : parseInt(this.auto_bet_session_profit)),
              on_win_increase_by: this.auto_bet_win_increase_by,
              on_win_increase_by_amount: (isNaN(parseInt(this.auto_bet_win_increase_value)) ? 0 : parseInt(this.auto_bet_win_increase_value)),
              on_loss_increase_by: this.auto_bet_loss_increase_by,
              on_loss_increase_by_amount: (isNaN(parseInt(this.auto_bet_loss_increase_value)) ? 0 : parseInt(this.auto_bet_loss_increase_value)),
              avatar: this.avatar
            })
            this.betBtnText = 'STOP AUTOBET'
            this.betBtnBackground = 'cashout_bg'
            if (this.auto_betting) { this.auto_bet_session_profit = 0 }
          }
        } else {
          if (this.crash_socket != null) {
            this.crash_socket.emit('onMessage', {
              code: 'AutoBetStop',
              user_id: this.user_id,
              user_name: this.name
            })
            this.betBtnText = 'AUTOBET'
            this.betBtnBackground = ''
            this.auto_bet_session_profit = 'Autobet off'
          }
        }
      }
    },
    update_btn() {
      if (this.auto_bet) { return }
      var label = 'BET'; var class_label = ''
      if (this.bet_temp > 0) {
        label = 'Cancel' // when you bet when graph is drawing
        class_label = 'cancel_bg'
      } else if (this.bet_amount > 0) {
        if (this.state === 'WAITING') {
          label = 'Betting...' // stand by with betting amount
          class_label = 'betting_bg'
        } else if (this.state === 'STARTED') {
          if (this.client_tick > this.auto_cashout_server && this.auto_cashout_server !== '0.00') { return }
          class_label = 'cashout_bg'
          label = 'Cashout '
          var cashVal = getNumberFormat(this.bet_amount * this.client_tick)
          this.betBtnSize = 'large'
          label += '@ ' + cashVal
        }
      }
      this.betBtnText = label
      this.betBtnBackground = class_label
    },
    init_timer() {
      if (this.timerHandler) return
      this.timerHandler = setInterval(this.intervalFunc, this.interval)
    },
    close_timer() {
      if (this.timerHandler === 0) return
      clearInterval(this.timerHandler)
      this.timerHandler = 0
    },
    intervalFunc() {
      this.sendEvent('game-created', { duration: this.timeLeft })
      this.timeLeft -= this.interval
      if (this.timeLeft <= 0) {
        clearInterval(this.timerHandler)
        this.timerHandler = 0
      }
      // now we get start signal from node server, we don't need to do sth
    },
    on_wait(data) {
      this.timeLeft = data.time_left
      this.state = 'WAITING'
      this.game_id = data.game_id
      this.reload({
        current_users: data.current_users,
        cashout_list: []
      })
      this.init_timer()
      // here ... we make bet if bet_temp is no 0
      if (this.bet_temp > 0) {
        // real bet here ...
        this.bet_amount = this.bet_temp
        this.bet_temp = 0 // now, we set bet_temp = 0 for next round
        this.do_bet()
      }
      this.update_btn()
    },
    do_bet() {
      this.auto_cashout_server = (this.auto_cashout === undefined || this.auto_cashout === null || isNaN(parseFloat(this.auto_cashout)) || parseFloat(this.auto_cashout) < 1 ? 0 : parseFloat(this.auto_cashout))
      this.crash_socket.emit('onMessage', {
        code: 'addBet',
        user_id: this.user_id,
        game_id: this.game_id,
        bet: this.bet_amount,
        user_name: this.name,
        avatar: this.avatar,
        auto_cashout: (this.auto_cashout === undefined || this.auto_cashout === null || isNaN(parseFloat(this.auto_cashout)) || parseFloat(this.auto_cashout) < 1 ? 0 : parseFloat(this.auto_cashout))
      })
    },
    do_tick(tick) {
      if (this.state !== 'STARTED') {
        this.start({ tick: tick })
      } else {
        this.tick = tick
        if (this.bet_amount > 0) this.update_btn() // then you need to show cashout
      }
    },
    reload(data) {
      this.current_users = data.current_users
      this.cashout_list = data.cashout_list

      if (!this.is_logged_in) return
      for (var i = 0; i < this.current_users.length; i += 1) {
        if (
          this.current_users[i].is_bot === 0 &&
          this.current_users[i].user_id === this.user_id
        ) {
          this.bet_amount = this.current_users[i].bet
          this.auto_cashout_server = parseFloat(this.current_users[i].bust / 100).toFixed(2)
          break
        }
      }
      this.update_btn()
    },
    crash(data) {
      this.state = 'CRASHED'
      this.tick = data.crash
      if (this.auto_betting) { this.auto_bet_session_profit = parseInt(this.auto_bet_session_profit) - parseInt(this.bet_amount) }
      this.bet_amount = 0
      this.sendEvent('game-finished', { crash: this.tick })
      this.update_btn()
      this.updateHistory(data)
    },
    start(data) {
      this.close_timer()
      // when game starts, it's tick will be zero
      this.tick = data.tick
      this.time_stamp = Date.now()
      // if betted, then he can cashout
      if (data.finish) {
        // on startfinish, i mean finished at 1x
        this.state = 'CRASHED'
        this.sendEvent('game-finished', { crash: this.tick })
        // $('title').html('Crashed at 1x - Crash | Tarobet')
      } else {
        this.state = 'STARTED'
        this.sendEvent('game-started', { crash: this.tick })
      }
      this.update_btn()
    },
    stop() {
      this.sendEvent('game-error', {})
    },
    sendEvent(msg, data) {
      this.eventBus = {
        msg: msg,
        payload: data
      }
    },
    updateAllBets() {
      this.all_tbl_items = []
      for (var i = 0; i < this.current_users.length + this.cashout_list.length; i++) {
        var list = []
        var index = 0
        if (i < this.cashout_list.length) {
          list = this.cashout_list
          index = i
        } else {
          list = this.current_users
          index = i - this.cashout_list.length
        }
        var data = {}
        data['id'] = list[index]['user_id']
        data['user'] = {
          name: list[index]['name'],
          url:
            list[index]['avatar'] === undefined ||
            list[index]['avatar'] === null
              ? ''
              : list[index]['avatar']
        }
        data['cashout'] = (isNaN(parseFloat(list[index]['cashout'])) || parseFloat(list[index]['cashout']) === 0) ? '-' : getFloat2Decimal(parseFloat(list[index]['cashout']))
        data['bet'] = list[index]['bet']
        data['bonus'] = '-'
        data['profit'] = list[index]['profit']
        data['name'] = list[index]['name']
        data['avatar'] = list[index]['avatar']
        this.all_tbl_items.push(data)
      }
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
  width: 100%;
}
.main-content {
  width: 100%;
  flex-direction: row-reverse;
  @include media-breakpoint-down(sm) {
    //flex-direction: column-reverse;
  }
}
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
.m-t {
  margin-top: $normal-margin-bottom-sm;
}
.all-bets {
  font-weight: 500;
  color: $primary;
}
.bots-table-wrapper {
  position: relative;
}
.bots-table-1 {
  position: absolute;
  top: calc( (100vh - 85px - 20px) / 2);
  width: calc(100% - 1vw);
  @include media-breakpoint-down(md) {
    position: relative;
    top: 0px;
    width: 100%;
  }
}
@media (min-width: 1700px)
{
  .c_col2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 16.66667%;
    flex: 0 0 16.66667%;
    max-width: 16.66667%;
  }
  .card-content {
    padding-top: 1.5vw;
    padding-left: 1.5vw;
    padding-bottom: 1.5vw;
    padding-right: 1.5vw;
  }
}

@media (min-width: 1310px) and (max-width: 1700px)
{
  .c_col2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .card-content {
    padding-top: 1.5vw;
    padding-left: 2vw;
    padding-bottom: 1.5vw;
    padding-right: 2vw;
  }
}

@media (min-width: 1120px) and (max-width: 1310px)
{
  .c_col2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.3%;
    flex: 0 0 33.3%;
    max-width: 33.3%;
  }
  .card-content {
    padding-top: 1.5vw;
    padding-left: 2vw;
    padding-bottom: 1.5vw;
    padding-right: 2vw;
  }
}

@media (min-width: 768px) and (max-width: 1120px)
{
  .c_col2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }
  .card-content {
    padding-top: 1.5vw;
    padding-left: 3vw;
    padding-bottom: 1.5vw;
    padding-right: 3vw;
  }
}

@media (min-width: 576px) and (max-width: 768px)
{
    .card-content {
      padding-top: 20px;
      padding-left: 4vw;
      padding-bottom: 1.5vw;
      padding-right: 4vw;
    }
}

@media (max-width: 576px)
{
    .card-content {
      padding-top: 20px;
      padding-left: 6.2vw;
      padding-bottom: 1.5vw;
      padding-right: 6.2vw;
    }
}

.content-padding {
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
  @include media-breakpoint-down(md) {
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-bottom: 50px;
  .p-l {
  }
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
    padding-right: 20px;
  }
}

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl, .col-xl-auto {
    padding-right: 0.5vw;
    padding-left: 0.5vw;
}

.betting-row {
  align-items: flex-end;
}

#history_info {
  position:absolute; right: 10px; top: 10px; color: #f2f4f6; z-index: 1000;
  width: 18px; height: 18px;
}

</style>
