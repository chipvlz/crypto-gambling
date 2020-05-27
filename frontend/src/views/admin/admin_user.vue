<template>
  <div>
    <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="200px" style="margin:20px;">
      <el-form-item label="Old Password" prop="old_pwd">
        <el-input v-model="temp.old_pwd" placeholder="Old password" type="password" />
      </el-form-item>
      <el-form-item label="New Password" prop="new_pwd">
        <el-input v-model="temp.new_pwd" placeholder="New password" type="password" />
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirm_pwd">
        <el-input v-model="temp.confirm_pwd" placeholder="Confirm password" type="password" />
      </el-form-item>
      <div>
        <el-button type="primary" @click="update()">
          Change
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import global from '@/mixins/global'
import { updateInfo } from '@/api/admin'
export default {
  components: {},
  mixins: [global],
  props: {},
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === undefined || value === '') {
        this.$message({
          message: 'Input content',
          type: 'warning'
        })
        callback(new Error('Input content.'))
      } else {
        callback()
      }
    }
    const validateConfirmRequire = (rule, value, callback) => {
      if (value === undefined || value === '') {
        this.$message({
          message: 'Input content',
          type: 'warning'
        })
        callback(new Error('Input content.'))
      } else if (value !== this.temp.new_pwd) {
        this.$message({
          message: 'Confirm password',
          type: 'warning'
        })
        callback(new Error('Confirm password'))
      } else {
        callback()
      }
    }
    return {
      temp: {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      },
      rules: {
        old_pwd: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ],
        new_pwd: [
          { required: true, trigger: 'blur', validator: validateRequire }
        ],
        confirm_pwd: [
          { required: true, trigger: 'blur', validator: validateConfirmRequire }
        ]
      }
    }
  },
  methods: {
    update() {
      // var self = this
      this.$refs['temp'].validate(valid => {
        if (valid) {
          updateInfo({
            old_pwd: this.temp.old_pwd,
            new_pwd: this.temp.new_pwd
          }).then(response => {
            this.showToast('Success', 'Password change successed', 'success')
          })
            .catch(err => {
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
