<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card class="box-container">
          <div slot="header">
            TODAY's {{ cardTitle[chartType].statistics_desc }} STATISTICS
          </div>
          <div class="box-item">
            <el-table :data="statistics" class="setting-table">
              <el-table-column label="Description" min-width="200">
                <template slot-scope="scope">
                  {{ scope.row.desc }}
                </template>
              </el-table-column>
              <el-table-column label="Value">
                <template slot-scope="scope">
                  {{ scope.row.value }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card class="box-container">
          <div slot="header">
            {{ cardTitle[chartType].visits_desc }} CHART FOR PREVIOUS MONTH
          </div>
          <div class="box-item">
            <line-chart :chart-data="visits" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchStatistics, fetchVisits } from '@/api/dashboard'
import LineChart from './LineChart'

const cardTitle = {
  'user': { statistics_desc: 'USER', visits_desc: 'USERS' },
  'betting': { statistics_desc: 'BETTING', visits_desc: 'BETTING' },
  'financial': { statistics_desc: 'FINANCIAL', visits_desc: 'FINANCIAL' }
}

export default {
  name: 'StatisticsChart',
  components: {
    LineChart
  },
  props: {
    chartType: {
      type: String,
      default: 'user'
    }
  },
  data() {
    return {
      statistics: [],
      visits: {
        unique_visits: [],
        page_views: []
      },
      cardTitle
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
      var yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd
      today = today + ' 00:00:00'
      today = Math.floor(new Date(today).getTime() / 1000)
      fetchStatistics({ type: this.chartType, params: { today: today }}).then(response => {
        if (this.chartType === 'user') {
          console.log(response)
        }
        this.statistics = response.data.values
      })
      fetchVisits({ type: this.chartType }).then(response => {
        this.visits = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .root-container {
//   padding: 20px;
// }
.box-container {
  margin-bottom: 20px;
}
</style>
