<template>
  <div class="login">
    <div class="loginContent">
      <h3 class="loginTop">后台管理系统</h3>
      <div class="loginForm">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <el-form-item prop="adminName">
            <el-input
              v-model="loginForm.adminName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="adminPwd">
            <el-input
              v-model="loginForm.adminPwd"
              placeholder="登录密码"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="success" @click="loginFormBtn" class="loginBtn"
            >登录</el-button
          >
          <el-button @click="resetLoginForm" type="info" class="resetBtn"
            >重置</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        adminName: '',
        adminPwd: ''
      },
      loginFormRules: {
        adminName: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
        ],
        adminPwd: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' }
        ]
      },
      powerListArr: []
    }
  },
  methods: {
    // 表单重置按钮
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录按钮
    loginFormBtn () {
      this.$refs.loginFormRef.validate(async value => {
        if (!value) return
        console.log(this.loginForm)
        const { data: b } = await this.$http.get('adminList/login', { params: this.loginForm })
        console.log(b)
        if (b.code !== 100) return this.$message.error(b.msg)
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('userToken', b.data.userToken)
        const powerList = b.data.adminModulList
        for (const item of powerList) {
          if (item.status === 1) {
            this.powerListArr.push(item.moduleId)
          }
        }
        window.sessionStorage.setItem('power', Base64.encode(this.powerListArr))
        window.sessionStorage.setItem('time', new Date().getTime())
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scpoed>
.login {
  // background-color: #4D4D4D;
  width: 100%;
  height: 100%;
  min-width: 600px;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginContent {
    width: 400px;
    height: 350px;
    position: relative;
    background-color: #f8f9f7;
    padding: 20px;
    border-radius: 5px;
    // background-color: #ccc;
    .loginTop {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      // color: #fff;
      font-size: 20px;
    }
  }
  .loginForm {
    position: absolute;
    top: 60px;
    // background-color: aqua;
    width: calc(100% - 40px);
    input {
      // border: none;
      // outline:none !important;
      // background-color:rgba(0,0,0,0)  ;
      width: 100%;
      // margin: 5px auto;
      height: 40px;
      // border-bottom: 1px solid #fff;
      font-size: 18px;
      // color: #fff;
    }
    .el-form-item__content {
      display: flex;
      .code {
        flex: 3;
      }
      .imgCode {
        flex: 2;
        background-color: #fff;
        height: 40px;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .btn {
    width: 100%;
    // background-color: red;
    display: flex;
    flex-wrap: wrap;
  }
  .loginBtn {
    width: 100%;
  }
  .resetBtn {
    width: 100%;
    margin-top: 20px;
    margin-left: 0 !important;
  }
}
</style>
