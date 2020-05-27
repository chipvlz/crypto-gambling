<template>
  <div class="admin-page">
    <b-row>
      <b-col sm="12" md="8" lg="8" xl="8" class="pt-2 pb-2">
        <b-row>
          <b-col sm="12" md="4" lg="4" xl="4" class="custom-model-select">
            <model-list-select
              v-model="listQuery.user_id"
              :list="users"
              option-value="ID"
              option-text="USERNAME"
              placeholder="select name"
              @input="handleFilter"
            />
          </b-col>
          <b-col sm="12" md="4" lg="4" xl="4">
            <el-date-picker v-model="listQuery.date_from" type="date" format="yyyy-MM-dd" placeholder="Please pick a start date" class="mr-2" @change="handleFilter" />
          </b-col>
          <b-col sm="12" md="4" lg="4" xl="4">
            <el-date-picker v-model="listQuery.date_to" type="date" format="yyyy-MM-dd" placeholder="Please pick a end date" class="mr-2" @change="handleFilter" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <el-table v-loading="listLoading" class="m-t" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="150px" align="center" label="Date">
        <template slot-scope="scope">
          <span v-if="isNaN(parseInt(scope.row.CREATE_TIME))">{{ scope.row.CREATE_TIME }}</span>
          <span v-else>{{ scope.row.CREATE_TIME | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="Username">
        <template slot-scope="scope">
          <span>{{ scope.row.USERNAME }}</span>
        </template>
      </el-table-column>

      <el-table-column width="240px" align="center" label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Amount Deposited">
        <template slot-scope="scope">
          <span>{{ scope.row.AMOUNT_DEPOSIT }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Amount Earned">
        <template slot-scope="scope">
          <span>{{ scope.row.AMOUNT_COINS }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Referral Code">
        <template slot-scope="scope">
          <span>{{ scope.row.REFERRAL_CODE }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Referral Username">
        <template slot-scope="scope">
          <span>{{ scope.row.REF_USERNAME }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getReferralList } from '@/api/bitcoin'
import { ModelListSelect } from 'vue-search-select'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import global from '@/mixins/global'
import { fetchList } from '@/api/user'
import { getDateFromString } from '@/utils/index'
import 'vue-search-select/dist/VueSearchSelect.css'

export default {
  components: {
    Pagination,
    ModelListSelect
  },
  mixins: [global],
  data() {
    return {
      list: null,
      users: [],
      total: 0,
      listLoading: true,
      usersLoading: true,
      listQuery: {
        date_from: null,
        date_to: null,
        start_date: null,
        end_date: null,
        user_id: 0,
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    this.listQuery.user_id = this.$router.history.current.query.item ? this.$router.history.current.query.item : 0
    this.getList()
  },
  created() {
    this.getUserList()
  },
  methods: {
    handleReferal(id) {
      this.listQuery.user_id = id
      this.getList()
    },
    getUserList() {
      fetchList({ limit: 999999 }).then(response => {
        this.users = response.data.items
        this.users.unshift({
          'ID': 0,
          'USERNAME': 'All'
        })
      })
    },
    getList() {
      this.listLoading = true
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
      getReferralList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
