<template>
  <div class="adduser">
    <el-form
      ref="addUserRef"
      :model="addUser"
      :rules="addUserRules"
      label-width="150px">
      <el-form-item
        label="用户昵称"
        prop="name">
        <el-input v-model="addUser.name" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone">
        <el-input
          v-model="addUser.phone"
          placeholder="请输入手机号"
          :disabled="userTitle==='修改用户'">
        </el-input>
      </el-form-item>
      <el-form-item
        label="性别">
        <el-radio v-model="addUser.gender" label="男">男</el-radio>
        <el-radio v-model="addUser.gender" label="女">女</el-radio>
      </el-form-item>
      <el-form-item
        label="城市">
        <el-input v-model="addUser.city" placeholder="请输入用户城市"></el-input>
      </el-form-item>
      <el-form-item
        label="余额">
        <el-input v-model="addUser.balance" placeholder="请输入余额"></el-input>
      </el-form-item>
      <el-form-item
        label="邀请人">
        <el-input v-model="addUser.invitees" placeholder="请输入邀请人"></el-input>
      </el-form-item>
      <el-form-item
        label="邀请码">
        <el-input v-model="addUser.invitationCode" placeholder="请输入邀请码"></el-input>
      </el-form-item>
      <el-form-item
        label="聊天群数量">
        <el-input v-model="addUser.chatGroup" placeholder="请输入聊天群数量"></el-input>
      </el-form-item>
      <el-form-item
        label="已当群主数量">
        <el-input v-model="addUser.groupLeader" placeholder="请输入已当群主数量"></el-input>
      </el-form-item>
      <el-form-item
        label="实名认证">
        <el-radio v-model="addUser.realName" label='0'>未认证</el-radio>
        <el-radio v-model="addUser.realName" label='1'>已认证</el-radio>
      </el-form-item>
      <el-form-item
        label="状态">
        <el-radio v-model="addUser.state" label='0'>正常</el-radio>
        <el-radio v-model="addUser.state" label='1'>冻结</el-radio>
      </el-form-item>
      <el-form-item
        label="登录密码">
        <el-input v-model="addUser.loginPwd" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item
        label="支付密码">
        <el-input v-model="addUser.paymentPwd" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item
        label="管理员ID">
        <el-input v-model="addUser.adminId" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['addUser', 'userTitle'],
  data () {
    var validatePhone = async (rule, value, callback) => {
      if (this.userTitle === '修改用户') {
        callback()
      }
      if (value === '') return callback(new Error('请输入手机号'))
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
        return callback(new Error('请输入正确的手机号码'))
      }
      await this.getPhone()
      if (this.code !== 100) {
        callback(new Error('手机号码已存在'))
      } else {
        callback()
      }
    }
    return {
      addUserRules: {
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      },
      code: null
    }
  },
  methods: {
    async getPhone () {
      const { data: res } = await this.$http.get(`userTable/checkUser?phone=${this.addUser.phone}`)
      this.code = res.code
      console.log(res)
    }
  }
}
</script>

<style>

</style>
