<template>
  <div class="admin-page">
    <div class="filter-container">
      <b-row>
        <b-col sm="12" md="8" lg="8" xl="8" class="pt-2 pb-2">
          <el-date-picker v-model="listQuery.start_date_obj" type="datetime" format="yyyy-MM-dd" placeholder="Please pick a start date" class="mr-2" @change="handleFilter" />
          <el-date-picker v-model="listQuery.end_date_obj" type="datetime" format="yyyy-MM-dd" placeholder="Please pick a end date" @change="handleFilter" />
        </b-col>
        <b-col sm="12" md="4" lg="4" xl="4" class="pt-2 pb-2">
          <el-button class="m-l" type="primary" style="float: right;" @click="handleFilter">
            Search
          </el-button>
        </b-col>
      </b-row>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Time">
        <template slot-scope="scope">
          <span>{{ makeDateFormat(scope.row.CREATE_TIME) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="User email">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="User name">
        <template slot-scope="scope">
          <span>{{ scope.row.USERNAME }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="Transfer Address">
        <template slot-scope="scope">
          <span>{{ scope.row.DETAIL }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="Withdrawal Amount(BTC)">
        <template slot-scope="scope">
          <span>{{ parseFloat(scope.row.AMOUNT_BTC).toFixed(8) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="Withdrawal Amount(Coins)">
        <template slot-scope="scope">
          <span>{{ setNumberFormat(scope.row.AMOUNT_COINS) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="Fee(BTC)">
        <template slot-scope="scope">
          <span>{{ parseFloat(scope.row.FEE).toFixed(8) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Status">
        <template slot-scope="{row}">
          <el-button v-if="row.STATUS == 0" type="danger" size="small" @click="handleConfirm(row)">
            Confirm
          </el-button>
          <span v-if="row.STATUS == 1">Complete</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { confirmWithdraw, getWithdrawList } from '@/api/bitcoin'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getNumberFormat, getDateFormat, getDateFromString } from '@/utils/index'
import global from '@/mixins/global'
import message from '@/filters/message'
export default {
  components: {
    Pagination
  },
  mixins: [global],
  props: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        start_date_obj: null,
        end_date_obj: null,
        start_date: null,
        end_date: null,
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.start_date = this.listQuery.start_date_obj == null ? '' : getDateFromString(this.listQuery.start_date_obj)
      this.listQuery.end_date = this.listQuery.end_date_obj == null ? '' : getDateFromString(this.listQuery.end_date_obj)
      if (this.listQuery.start_date !== '') {
        this.listQuery.start_date = this.listQuery.start_date + ' 00:00:00'
        this.listQuery.start_date = Math.floor(new Date(this.listQuery.start_date).getTime() / 1000)
      }
      if (this.listQuery.end_date !== '') {
        this.listQuery.end_date = this.listQuery.end_date + ' 23:59:59'
        this.listQuery.end_date = Math.floor(new Date(this.listQuery.end_date).getTime() / 1000)
      }
      getWithdrawList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
        .catch(() => {
          this.showToast('Error', message.disconnect_err_msg1, 'error')
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    makeDateFormat(str) {
      return getDateFormat(str)
    },
    setNumberFormat(num) {
      return getNumberFormat(num)
    },
    handleConfirm(row) {
      const loader = this.showOverlay(null)
      confirmWithdraw({ who: row.USER_ID, withdraw_id: row.ID }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', message.withdraw_confirm_success, 'success')
          this.handleFilter()
        } else {
          this.showToast('Error', response.message, 'error')
        }
        this.hideOverlay(loader)
      })
        .catch(() => {
          this.showToast('Error', message.disconnect_err_msg1, 'error')
          this.hideOverlay(loader)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/admin_variables.scss";
.admin-page {
    padding: $page-padding;
}
.m-l {
    margin-left: $page-margin-left;
}
.m-t {
    margin-top: $page-margin-top;
}
</style>
