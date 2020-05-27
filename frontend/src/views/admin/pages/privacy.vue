<template>
  <div class="admin-page">
    <el-row>
      <el-button class="m-l" type="primary" style="float: right;" @click="changeFunc">Change
      </el-button>
    </el-row>
    <el-row class="m-t page-content-value label">
      <vue-ckeditor v-model="value" type="classic" :editors="editors" />
    </el-row>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import VueCkeditor from 'vue-ckeditor5'
import global from '@/mixins/global'
import { getUserVariable, updateUserVariable } from '@/api/user'
const typeOptions = [
  { key: 0, display_name: 'Getting started with Redexc' },
  { key: 1, display_name: 'Payment on Redexc' }
]
export default {
  components: {
    'vue-ckeditor': VueCkeditor.component
  },
  filters: {
    typeFilter(type) {
      return typeOptions[type].display_name
    }
  },
  mixins: [global],
  props: {},
  data() {
    return {
      value: 'hello',
      editors: {
        classic: ClassicEditor
      }
    }
  },
  created() {
    this.getValue()
  },
  methods: {
    getValue() {
      const loader = this.showOverlay(null)
      getUserVariable({ 'variable': 'PRIVACY_AND_POLICY' }).then(response => {
        this.value = response.data.value
        this.hideOverlay(loader)
      })
    },
    changeFunc() {
      const loader = this.showOverlay(null)
      // updateReferralValue
      updateUserVariable({ 'variable': 'PRIVACY_AND_POLICY', 'value': this.value }).then(response => {
        if (response.status === 'success') {
          this.showToast('Success', 'Privacy and policy is changed successfully.', 'success')
          this.hideOverlay(loader)
        } else {
          this.showToast('Error', 'Failed to change privacy and policy.', 'error')
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
    color: black !important;
}
.m-l {
    margin-left: $page-margin-left;
}
.m-t {
    margin-top: $page-margin-top;
}

</style>
