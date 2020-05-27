<template>
  <div class="admin-page">
    <el-col>
      <el-row class="chart-item">
        <statistics-chart chart-type="user" />
      </el-row>
      <el-row class="chart-item">
        <statistics-chart chart-type="betting" />
      </el-row>
      <el-row class="chart-item">
        <statistics-chart chart-type="financial" />
      </el-row>
    </el-col>
  </div>
</template>

<script>
import StatisticsChart from './components/StatisticsChart'
export default {
  name: 'Dashboard',
  components: {
    StatisticsChart
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/admin_variables.scss";
.admin-page {
  padding: $page-padding;
}
.chart-item {
  // margin-bottom: 20px;
}
</style>
