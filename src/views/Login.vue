<template>
  <div class="login">
    <div class="loginContent">
      <div class="loginTop">后台管理系统</div>
      <div class="loginForm">
        <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef">
          <el-form-item prop="adminName">
            <el-input v-model="loginForm.adminName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="adminPwd">
            <el-input v-model="loginForm.adminPwd" placeholder="登录密码" type="password"></el-input>
          </el-form-item>
        </el-form>
        <button class="loginBtn" @click="loginFormBtn">登录</button>
        <button class="resetBtn" @click="resetLoginForm">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
// const Base64 = require('js-base64').Base64
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
      }
      // url: ''
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
        this.$router.push('/home')
      })
      //   const obj = Base64.encode(JSON.stringify(b.data.userAuthority))
      //   window.sessionStorage.setItem('obj', obj)
      //   window.sessionStorage.setItem('idc', b.data.idc)
      //   window.sessionStorage.setItem('userName', b.data.userName)
      //   const mm = Base64.encode(b.data.loginPassword)
      //   window.sessionStorage.setItem('passWord', mm)
      //   this.$router.push('/statistical')
      // })
    }
  }
}
</script>

<style lang='less' scpoed>
.login{
  background-color: #4D4D4D;
  width: 100%;
  height: 100%;
  min-width: 600px;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginContent{
    width: 300px;
    height: 350px;
    position: relative;
    // background-color: #ccc;
    .loginTop{
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      color: #fff;
      font-size: 20px;
    }
  }
  .loginForm{
    position: absolute;
    top: 40px;
    // background-color: aqua;
    width: 100%;
    input{
      border: none;
      outline:none !important;
      background-color:rgba(0,0,0,0)  ;
      width: 100%;
      // margin: 5px auto;
      height: 40px;
      border-bottom: 1px solid #fff;
      font-size: 18px;
      color: #fff;
    }
    .el-form-item__content{
      display: flex;
      .code{
      flex:3;
      }
      .imgCode{
      flex: 2;
      background-color:#fff;
      height: 40px;
      margin-left: 5px;
      cursor: pointer;
      }
    }
  }
  .loginBtn{
    width: 100%;
    margin-top: 40px;
    height: 40px;
    outline: none;
    border-radius: 7px;
    cursor: pointer;
    background-color: #fff;
    // font-size: 18px;
  }
  .resetBtn{
    width: 100%;
    background-color:rgba(0,0,0,0);
    border-radius: 7px;
    outline: none;
    border: 1px solid #fff;
    height: 40px;
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
