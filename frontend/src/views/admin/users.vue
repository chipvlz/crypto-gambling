<template>
  <div class="admin-page">
    <div class="filter-container">
      <el-input v-model="listQuery.search_key" placeholder="Name" style="width: 200px;" @keyup.enter.native="handleFilter" />
      <el-button class="m-l" type="primary" @click="handleFilter">
        Search
      </el-button>
    </div>
    <el-table v-loading="listLoading" class="m-t" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="Avatar">
        <template slot-scope="scope">
          <img :src="scope.row.AVATAR" alt="Avatar" width="40px" height="40px">
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Username">
        <template slot-scope="scope">
          <span class="cursor-pointer" @click="handleReferal(scope.row)">{{ scope.row.USERNAME }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Wallet">
        <template slot-scope="scope">
          <span>{{ scope.row.WALLET }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Registeration Date">
        <template slot-scope="scope">
          <span>{{ scope.row.CREATE_TIME | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.STATE | statusFilter">
            {{ scope.row.STATE | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="Referral code">
        <template slot-scope="scope">
          <span>{{ scope.row.REFERRAL_CODE }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Referral Users">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.cnt }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="left" label="Actions">
        <template slot-scope="{row}">
          <el-button type="danger" size="small" @click="handleDel(row)">
            Delete
          </el-button>
          <el-button v-if="row.STATE == 0" type="primary" size="small" @click="handleBlock(row)">
            Block
          </el-button>
          <el-button v-if="row.STATE == 2" type="info" size="small" @click="handleActivate(row)">
            Activate
          </el-button>
          <el-button type="warning" size="small" @click="handleResetPassword(row)">
            Reset Password
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="Reset Password" :visible.sync="dlgVisible">
      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="160px" style="width: 400px margin-left:50px">
        <el-form-item label="New Password" prop="new_password">
          <el-input v-model="temp.new_password" type="password" placeholder="New Password" />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirm_password">
          <el-input v-model="temp.confirm_password" type="password" placeholder="Confirm Password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="resetPassword()">
          Reset
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, updateUser, resetPassword } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import message from '@/filters/message'
import global from '@/mixins/global'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = ['success', 'danger', 'info']
      return statusMap[status]
    },
    statusTextFilter(status) {
      const statusTextMap = ['active', 'stop', 'block']
      return statusTextMap[status]
    }
  },
  mixins: [global],
  props: {},
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: 'Content is empty.',
          type: 'warning'
        })
        callback(new Error('Content is empty.'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search_key: '',
        page: 1,
        limit: 20
      },
      dlgVisible: false,
      temp: {
        new_password: '',
        confirm_password: '',
        user_id: 0
      },
      rules: {
        new_password: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ],
        confirm_password: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleReferal(row) {
      this.$router.push({ path: '/admin/referral', query: { item: row.ID }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDel(row) {
      updateUser({ id: row.ID, del_yn: 'Y' }).then(response => {
        this.getList()
      })
    },
    handleBlock(row) {
      updateUser({ id: row.ID, state: 2 }).then(response => {
        this.getList()
      })
    },
    handleActivate(row) {
      updateUser({ id: row.ID, state: 0 }).then(response => {
        this.getList()
      })
    },
    resetTemp() {
      this.temp = {
        new_password: '',
        confirm_password: ''
      }
    },
    handleResetPassword(row) {
      this.resetTemp()
      this.temp.user_id = row.ID
      this.dlgVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    resetPassword() {
      if (this.temp.new_password !== this.temp.confirm_password) {
        this.showToast('Error', message.admin_reset_password_err, 'error')
        return
      }
      this.$refs['temp'].validate(valid => {
        if (valid) {
          resetPassword(this.temp)
            .then(response => {
              this.dlgVisible = false
              this.getList()
              if (response.status === 'success') {
                this.showToast('Success', message.admin_reset_password_success, 'success')
              } else {
                this.showToast('Error', response.message, 'error')
              }
            })
            .catch(err => {
              console.log(err)
              this.dlgVisible = false
            })
        }
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
.cursor-pointer {
  cursor: pointer
}
</style>
