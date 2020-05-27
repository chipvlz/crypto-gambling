<template>
  <b-modal
    id="crash-game-detail-form"
    centered
    scrollable
    hide-footer
    modal-class="game-detail-form"
    header-class="border-bottom-0"
    size="xl"
    @show="showModal"
  >
    <b-container fluid>
      <b-row class="detail-header">
        <b-col class="label">
          CrashGame #{{ detail_id }} information
        </b-col>
        <b-col class="label go-to-crash-history">
          <span @click="gotoCrashHistory">
            Go to crash history
          </span>
        </b-col>
      </b-row>
      <b-row class="detail-sub-header-hash m-t-15">
        <b-col class="label" cols="3">
          Hash:
        </b-col>
        <b-col class="label" cols="9">
          {{ hash }}
        </b-col>
      </b-row>
      <b-row class="detail-sub-header-hash m-t-7">
        <b-col class="label" cols="3">
          Game Played Time:
        </b-col>
        <b-col class="label" cols="9">
          {{ game_time }}
        </b-col>
      </b-row>
      <b-row class="detail-sub-header-hash m-t-7">
        <b-col class="label" cols="3">
          Crashed At:
        </b-col>
        <b-col class="label" cols="9">
          {{ crashed_at }}x
        </b-col>
      </b-row>
      <b-row class="detail-sub-header m-t-15">
        <b-col class="label">
          <b-table striped :items="items" class="text-light game-info-detail-table" responsive />
        </b-col>
      </b-row>
    </b-container>
    <!--
      <log-in-button text="LogIn" @click="onLogIn" />
    -->
  </b-modal>
</template>
<script>
// import LogInButton from '@/components/navbar/LogInButton'
import global from '@/mixins/global'
import { mapGetters } from 'vuex'
import { getGameDetailInfo } from '@/api/crash'
import message from '@/filters/message'
import { getDateFormat /*, getNumberFormat*/ } from '@/utils/index'
// import message from '@/filters/message.js'
export default {
  components: {
  //  LogInButton
  },
  mixins: [global],
  data() {
    return {
      hash: '',
      game_time: '',
      crashed_at: 0,
      items: []
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'wallet',
      'avatar',
      'crash_server_url',
      'detail_id',
      'user_id',
      'name',
      'token'
    ])
  },
  mounted() {
  },
  methods: {
    gotoCrashHistory() {
      if (this.$route.path !== '/history') { this.$router.push({ name: 'history' }) }
      this.$bvModal.hide('crash-game-detail-form')
    },
    showModal() {
      getGameDetailInfo({ id: this.detail_id }).then(response => {
        if (response.status === 'success') {
          this.hash = response.data.hash
          this.game_time = getDateFormat(response.data.time)
          this.crashed_at = parseFloat(response.data.crashed_at / 100).toFixed(2)
          this.items = response.data.items
        } else {
          this.showToast('Error', response.message, 'error')
        }
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
      })
    },
    onLogIn() {
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.detail-header .label {
  color: #fff;
  font-size: 14px;
  word-break: break-word;
}

.detail-sub-header-hash .label {
  color: #fff;
  font-size: 12px;
  word-break: break-word;
}

table {
  color: #fff;
}

.m-t-15 {
  margin-top: 15px;
}
.m-t-7 {
  margin-top: 7px;
}

.go-to-crash-history {
  cursor: pointer;
  span {
    color: #53f549;
    text-decoration: underline;
  }
}
</style>

