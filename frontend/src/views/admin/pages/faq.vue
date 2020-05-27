<template>
  <div class="admin-page">
    <div class="filter-container">
      <b-row>
        <b-col sm="12" md="8" lg="8" xl="8" class="pt-2">
          <el-input v-model="listQuery.search_key" placeholder="Content" style="width: 200px;" @keyup.enter.native="handleFilter" />
        </b-col>
        <b-col sm="12" md="4" lg="4" xl="4" class="pt-2">
          <el-button class="m-l" type="primary" style="float: right;" @click="handleAdd">
            Add
          </el-button>
          <el-button class="m-l" type="primary" style="float: right;" @click="handleFilter">
            Search
          </el-button>
        </b-col>
      </b-row>
    </div>
    <el-table v-loading="listLoading" class="m-t" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="Time">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="Question">
        <template slot-scope="scope">
          <span>{{ scope.row.question }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Answer">
        <template slot-scope="scope">
          <span>{{ scope.row.answer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button type="danger" size="small" @click="handleDel(row)">
            Delete
          </el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dlgTextMap[dlgStatus]" :visible.sync="dlgVisible">
      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px margin-left:50px">
        <el-form-item label="Question" prop="question">
          <el-input v-model="temp.question" placeholder="Input Question" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="Answer" prop="answer">
          <el-input v-model="temp.answer" placeholder="Input Answer" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="createFaq()">
          Add Question
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import global from '@/mixins/global'
import { getList, addItem } from '@/api/faq'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const typeOptions = [
  { key: 0, display_name: 'Getting started with Redexc' },
  { key: 1, display_name: 'Payment on Redexc' }
]

export default {
  components: {
    Pagination
  },
  filters: {
    typeFilter(type) {
      return typeOptions[type].display_name
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
    const validateOptionRequire = (rule, value, callback) => {
      if (value === undefined || value === '') {
        this.$message({
          message: 'Select item.',
          type: 'warning'
        })
        callback(new Error('Select item'))
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
      temp: {
        answer: '',
        question: '',
        id: 0
      },
      typeOptions,
      dlgVisible: false,
      dlgStatus: 'create',
      dlgTextMap: {
        update: 'Update',
        create: 'Add'
      },
      rules: {
        answer: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ],
        question: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ],
        type: [
          { required: true, trigger: 'blur', validator: validateOptionRequire }
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
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.resetTemp()
      this.dlgStatus = 'create'
      this.dlgVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    handleDel(row) {
      addItem({
        answer: '',
        question: '',
        id: row.id,
        del_yn: 'y'
      })
        .then(response => {
          this.getList()
        })
        .catch(() => {
          this.showToast('Error', 'Network connection error.', 'error')
          this.dlgVisible = false
        })
    },
    handleEdit(row) {
      this.resetTemp()
      this.temp.answer = row.answer
      this.temp.question = row.question
      this.temp.id = row.id
      this.dlgVisible = true
      this.dlgStatus = 'update'
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        answer: '',
        question: '',
        id: 0
      }
    },
    createFaq() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          addItem(this.temp)
            .then(response => {
              this.dlgVisible = false
              this.getList()
            })
            .catch(() => {
              this.showToast('Error', 'Network connection error.', 'error')
              this.dlgVisible = false
            })
        }
      })
    },
    updateFaq() {}
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
