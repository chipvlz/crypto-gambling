<template>
  <div class="admin-page">
    <div class="filter-container">
      <b-row>
        <b-col sm="12" md="8" lg="8" xl="8" class="pt-2 pb-2">
          <el-date-picker v-model="listQuery.start_date_obj" type="datetime" format="yyyy-MM-dd" placeholder="Please pick a date" class="mr-2" @change="handleFilter" />
          <el-date-picker v-model="listQuery.end_date_obj" type="datetime" format="yyyy-MM-dd" placeholder="Please pick a date" @change="handleFilter" />
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
          <span class="link-type" @click="showDetail(scope.row.GAMENO)">{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="Time">
        <template slot-scope="scope">
          <span class="link-type" @click="showDetail(scope.row.GAMENO)">{{ scope.row.REGTIME | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="GameRound">
        <template slot-scope="scope">
          <span>{{ scope.row.GAMENO }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="BUST">
        <template slot-scope="scope">
          <span v-if="scope.row.BUST < 197" style="color: rgb(216, 20, 20);">{{ parseFloat(scope.row.BUST / 100).toFixed(2) + 'x' }}</span>
          <span v-if="scope.row.BUST >= 197" style="color: rgb(7, 177, 7);">{{ parseFloat(scope.row.BUST / 100).toFixed(2) + 'x' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Total">
        <template slot-scope="scope">
          <span>{{ scope.row.TOTAL_REAL }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Profit">
        <template slot-scope="scope">
          <span>{{ scope.row.PROFIT }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Bots">
        <template slot-scope="scope">
          <span>{{ scope.row.BOTS }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Hash">
        <template slot-scope="scope">
          <span>{{ scope.row.HASH }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dlgVisible" title="Detail">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dlgVisible = false">Confirm</el-button>
      </span>
      <el-table v-loading="dlgListLoading" :data="dlgList" border fit highlight-current-row style="width: 100%">

        <el-table-column width="150px" align="center" label="Name">
          <template slot-scope="scope">
            <span>{{ scope.row.IS_BOT == 0 ? scope.row.USER_NAME : scope.row.BOT_NAME }}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" label="BOT">
          <template slot-scope="scope">
            <span>{{ scope.row.IS_BOT == 0 ? 'No' : 'Yes' }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160px" align="center" label="Time">
          <template slot-scope="scope">
            <span>{{ scope.row.CREATE_TIME | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" label="Bet Amount">
          <template slot-scope="scope">
            <span>{{ scope.row.BET_AMOUNT }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="CashOut Rate">
          <template slot-scope="scope">
            <span v-if="scope.row.CASHOUTRATE > 0">{{ parseFloat(scope.row.CASHOUTRATE).toFixed(2) + 'x' }}</span>
            <span v-if="scope.row.CASHOUTRATE <= 0" style="color: rgb(216, 20, 20);">Lose</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="Profit">
          <template slot-scope="scope">
            <span v-if="scope.row.CASHOUTRATE > 0">{{ scope.row.PROFIT }}</span>
            <span v-if="scope.row.CASHOUTRATE <= 0" style="color: rgb(216, 20, 20);">{{ -scope.row.BET_AMOUNT }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getHistoryList, getLog } from '@/api/crash'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getFloat2Decimal } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    profitFilter(profit) {
      return getFloat2Decimal(profit)
    }
  },
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
      },
      dlgListLoading: true,
      dlgList: [],
      dlgVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.start_date = this.listQuery.start_date_obj == null ? '' : this.listQuery.start_date_obj.toISOString().substr(0, 10)
      this.listQuery.end_date = this.listQuery.end_date_obj == null ? '' : this.listQuery.end_date_obj.toISOString().substr(0, 10)
      getHistoryList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    startDatePick() {
    },
    endDatePick() {
    },
    showDetail(id) {
      this.dlgVisible = true
      this.dlgListLoading = true
      getLog({ id: id }).then(response => {
        this.dlgList = response.data.items
        this.dlgListLoading = false
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
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;

  &:hover {
    color: rgb(32, 160, 255);
  }
}
</style>
