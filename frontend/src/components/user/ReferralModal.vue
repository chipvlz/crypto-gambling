<template>
  <b-modal
    id="referral-modal"
    v-model="show"
    centered
    hide-footer
    modal-class="login-signup-form"
    size="lg"
    header-class="border-bottom-0"
    :static="true"
  >
    <h2>Referrals</h2>
    <b-row>
      <b-col sm="12" md="12" lg="4" xl="4" class="pt-2 pb-2">
        <model-list-select
          v-model="listQuery.user_id"
          class="mr-2"
          :list="user_list"
          option-value="ID"
          option-text="USERNAME"
          placeholder="select name"
          @input="handleFilter"
        />
      </b-col>
      <b-col sm="12" md="12" lg="4" xl="4" class="pt-2 pb-2">
        <el-date-picker v-model="listQuery.date_from" type="date" format="yyyy-MM-dd" placeholder="Please pick a start date" class="mr-2" @input="handleFilter" />
      </b-col>
      <b-col sm="12" md="12" lg="4" xl="4" class="pt-2 pb-2">
        <el-date-picker v-model="listQuery.date_to" type="date" format="yyyy-MM-dd" placeholder="Please pick a end date" class="mr-2" @input="handleFilter" />
      </b-col>
    </b-row>
    <bit-crash-table :fields="tbl_fields" :items="list" crash-type="1" class="mt-2" />
  </b-modal>
</template>
<script>
import BitCrashTable from '@/components/crashTable/BitCrashTable.vue'
import { getReferralList } from '@/api/bitcoin'
import { getDateFromString } from '@/utils/index'
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
export default {
  components: {
    BitCrashTable,
    ModelListSelect
  },
  props: {
    users: {
      type: Array,
      default: function() {
        return []
      }
    },
    userId: {
      type: Number,
      default: 0
    },
    myId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: false,
      list: [],
      total: 0,
      user_list: [],
      listQuery: {
        date_from: null,
        date_to: null,
        start_date: null,
        end_date: null,
        user_id: this.userId,
        page: 1,
        limit: 20
      },
      tbl_fields: [
        {
          id: 1,
          label: 'Date',
          type: 'date',
          key: 'CREATE_TIME'
        },
        {
          id: 2,
          label: 'User Avatar',
          type: 'profile',
          key: 'avatar'
        },
        {
          id: 3,
          label: 'User name',
          type: 'plain',
          key: 'REF_USERNAME'
        },
        {
          id: 4,
          label: 'Amount Deposited',
          type: 'plain',
          key: 'AMOUNT_DEPOSIT'
        },
        {
          id: 5,
          label: 'Amount Earned',
          type: 'plain',
          key: 'AMOUNT_COINS'
        }
      ]
    }
  },
  watch: {
    show(newVal) {
      this.user_list = []
      for (let i = 0; i < this.users.length; i++) {
        this.user_list.push({
          ...this.users[i]
        })
      }
      this.user_list.unshift({
        'ID': this.userId,
        'USERNAME': 'All'
      })
      this.$emit('visibleChanged', newVal)
      if (newVal) {
        this.listQuery.user_id = this.userId
        this.getList()
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      if (!this.listQuery.user_id) {
        this.listQuery.user_id = this.myId
      }
      var filtered_list = this.users.filter(item => item.ID === this.listQuery.user_id)
      if (filtered_list.length) {
        this.listQuery.txhash = filtered_list[0].REFERRAL_CODE
      } else {
        this.listQuery.txhash = ''
      }
      this.listQuery.start_date = this.listQuery.date_from == null ? '' : getDateFromString(this.listQuery.date_from)
      this.listQuery.end_date = this.listQuery.date_to == null ? '' : getDateFromString(this.listQuery.date_to)
      if (this.listQuery.start_date !== '') {
        this.listQuery.start_date = this.listQuery.start_date + ' 00:00:00'
        this.listQuery.start_date = Math.floor(new Date(this.listQuery.start_date).getTime() / 1000)
      }
      if (this.listQuery.end_date !== '') {
        this.listQuery.end_date = this.listQuery.end_date + ' 23:59:59'
        this.listQuery.end_date = Math.floor(new Date(this.listQuery.end_date).getTime() / 1000)
      }
      var query = {
        ...this.listQuery
      }
      if (filtered_list.length) {
        query.user_id = 0
      }
      getReferralList(query).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

