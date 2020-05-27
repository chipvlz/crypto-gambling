<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center history-title">
              <b-col class="label">
                Crash History
              </b-col>
            </b-row>
            <b-row class="crash-game-history-table m-t-30">
              <b-col class="label">
                <b-table
                  hover
                  show-empty
                  striped
                  :items="items"
                  class="text-light game-info-detail-table"
                  responsive
                  @row-clicked="myRowClickHandler"
                />
              </b-col>
            </b-row>
            <b-row class="crash-game-history-load-more">
              <b-col>
                <crash-button text="Load More..." class="history-load-more" @click="loadMoreFunc" />
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
import titleMixin from '@/mixins/titleMixin'
import { getGameHistory } from '@/api/crash'
import global from '@/mixins/global'
import message from '@/filters/message'
import CrashButton from '@/components/ui/CrashButton.vue'
export default {
  name: 'Home',
  title: 'Crash history - Redexc',
  components: {
    BitCrashCard,
    CrashButton
    // MenuBar
  },
  mixins: [titleMixin, global],
  data() {
    return {
      items: [],
      limit: 50,
      page: 1
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
  created: function() {
    this.loadMore()
  },
  methods: {
    myRowClickHandler(record, index) {
      this.$store.dispatch('app/setDetailId', { detail_id: record.gameid })
      this.$bvModal.show('crash-game-detail-form')
    },
    loadMore() {
      getGameHistory({ id: 0, start_date: '', end_date: '', page: this.page, limit: this.limit }).then(response => {
        if (response.status === 'success') {
          this.items = this.items.concat(response.data.items)
        } else {
          this.showToast('Error', response.message, 'error')
        }
      }).catch(() => {
        this.showToast('Error', message.disconnect_err_msg1, 'error')
      })
    },
    loadMoreFunc() {
      this.page = this.page + 1
      this.loadMore()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.crash-game-history-table {
  padding-left: 20px;
  padding-right: 20px;
  @include media-breakpoint-down(sm) {
      padding-left: 0px;
      padding-right: 0px;
  }
}

.crash-game-history-load-more .col {
  display: flex;
  justify-content: center;
}

.history-load-more {
  width: 200px !important;
}

.history-title .label {
    font-weight: bold;
    color: #c9d6e4;
    font-size: 2rem;
    letter-spacing: .025em;
    line-height: 1.25;
}

.root {
  position: relative;
  width: 100%;
}
.with-menu {
  @include media-breakpoint-down(md) {
    padding-left: 50px;
  }
  padding-left: calc(50px + #{$menu-width});
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

.m-t-30 {
  margin-top: 30px;
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
@media (min-width: 1600px)
{
  .deposit-coin ,
  .deposit-btc {
    width: 20%;
  }
}
@media (max-width: 1600px) and (min-width: 1200px)
{
  .deposit-coin ,
  .deposit-btc {
    width: 30%;
  }
}

@media (max-width: 1200px) and (min-width: 600px)
{
  .deposit-coin ,
  .deposit-btc {
    width: 35%;
  }
}
@media (max-width: 600px)
{
  .deposit-coin ,
  .deposit-btc {
    width: 40%;
  }
}

</style>
