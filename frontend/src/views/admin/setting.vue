<template>
  <div class="admin-page">
    <div class="filter-container">
      <div class="referral-label">Referral bonus(%)</div>
      <el-input v-model="referral_value" placeholder="Referral bonus(%)" style="width: 200px;" />
      <el-button class="m-l" type="primary" @click="changeFunc">
        Change
      </el-button>
    </div>
    <div class="filter-container m-t-30">
      <div class="referral-label">Withdrawal Fee(%)</div>
      <el-input v-model="withdraw_fee" placeholder="Withdrawal Fee(%)" style="width: 200px;" />
      <el-button class="m-l" type="primary" @click="changeWithdrawalFee">
        Change
      </el-button>
    </div>
  </div>
</template>

<script>
import global from '@/mixins/global'
import { getReferralValue, updateReferralValue, updateWithdrawalFee } from '@/api/user'
export default {
  components: {
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
    return {
      listLoading: true,
      referral_value: 0,
      withdraw_fee: 0
    }
  },
  created() {
    this.getReferral()
  },
  methods: {
    getReferral() {
      getReferralValue({}).then(response => {
        this.referral_value = response.data.referral_value
        this.withdraw_fee = response.data.withdraw_fee
      }).catch(() => {
        this.showToast('Error', 'Network connection error.', 'error')
      })
    },
    changeFunc() {
      if (this.referral_value === '' || isNaN(parseFloat(this.referral_value))) {
        this.showToast('Error', 'Please check the accuracy of the input value.', 'error')
        return
      }
      const loader = this.showOverlay(null)
      // updateReferralValue
      updateReferralValue({ referral_value: this.referral_value }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', 'Referral bonus value is changed successfully.', 'success')
          this.hideOverlay(loader)
        } else {
          this.showToast('Error', 'Failed to change referral bonus value.', 'error')
          this.hideOverlay(loader)
        }
      }).catch(() => {
        this.showToast('Error', 'Network connection error.', 'error')
        this.hideOverlay(loader)
      })
    },
    changeWithdrawalFee() {
      if (this.withdraw_fee === '' || isNaN(parseFloat(this.withdraw_fee))) {
        this.showToast('Error', 'Please check the accuracy of the input value.', 'error')
        return
      }
      const loader = this.showOverlay(null)
      updateWithdrawalFee({ withdraw_fee: this.withdraw_fee }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', 'Withdrawal Fee is changed successfully.', 'success')
          this.hideOverlay(loader)
        } else {
          this.showToast('Error', 'Failed to change withdrawal fee', 'error')
          this.hideOverlay(loader)
        }
      }).catch(() => {
        this.showToast('Error', 'Network connection error.', 'error')
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
    display: flex;
    flex-direction: column;
}
.referral-label {
  width: 140px;
  min-width: 80px;
}
.m-l {
    margin-left: $page-margin-left;
}
.m-t {
    margin-top: $page-margin-top;
}
.m-t-30 {
  margin-top: 30px;
}
.filter-container {
  align-items: center;
  display: flex;
  .referral-label {
    color: #000;
    margin-right: 15px;
  }
}
</style>
