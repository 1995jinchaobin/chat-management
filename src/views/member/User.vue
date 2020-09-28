<template>
  <div class="userlist">
    <div class="addUserBtn">
      <el-button
        type="success"
        @click="showAddDialogBtn('add')"
        v-if="isWrite === 'isWriteQweasd'"
        >添加用户</el-button
      >
    </div>
    <!-- 固定搜索按钮 -->
    <div class="searchBtn">
      <el-button
        :type="item.value === 'all' ? 'success' : ''"
        :class="activeBtnValue === item.value ? 'activeBtn' : ''"
        v-for="item in searchBtnValue"
        :key="item.id"
        @click="allUserList(item.value)"
      >
        {{ item.name }}
      </el-button>
    </div>
    <!-- 下拉搜索 -->
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        clearable
        @clear="seacrchOptionBtn"
        @change="seacrchOptionBtn"
      >
        <el-select v-model="OptionValue" slot="prepend" placeholder="请选择">
          <el-option
            v-for="item in searchOptionsList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="seacrchOptionBtn"
        >
        </el-button>
      </el-input>
      <el-date-picker
        v-model="userListParams.chooseRlTime"
        type="date"
        placeholder="最后登陆时间"
        @change="allUserList(userListParams.chooseRlTime)"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </div>
    <el-table :data="userList" stripe border>
      <el-table-column align="center" prop="id" label="ID" min-width="60%">
      </el-table-column>
      <el-table-column prop="name" label="昵称" align="center" min-width="50%">
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img
            :src="$imgUrl + scope.row.userImg"
            class="imgSmall"
            @click="lookImg(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="city" align="center" label="城市" min-width="50%">
      </el-table-column>
      <!-- <el-table-column
        prop="phone"
        align="center"
        label="手机号">
      </el-table-column> -->
      <!-- <el-table-column
        prop="balance"
        align="center"
        label="余额">
      </el-table-column> -->
      <!-- <el-table-column
        prop="invitees"
        align="center"
        label="邀请人">
      </el-table-column> -->
      <!-- <el-table-column
        prop="invitationCode"
        label="邀请码"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="chatGroup"
        label="聊天群数量"
        align="center"
        min-width="50"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupLeader"
        label="已当群主数量"
        min-width="50"
      >
      </el-table-column>
      <el-table-column
        prop="grade"
        align="center"
        label="会员等级"
        min-width="50"
      >
      </el-table-column>
      <el-table-column align="center" label="实名认证" min-width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.realName === 0" class="red">未认证</span>
          <span v-else>已认证</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="recentlyLanded"
        label="最后登录时间">
      </el-table-column> -->
      <el-table-column align="center" label="状态" min-width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0">正常</span>
          <span v-else class="red">冻结</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="loginPwd"
        align="center"
        label="登密码">
      </el-table-column> -->
      <!-- <el-table-column
        align="center"
        prop="paymentPwd"
        label="支付密码">
      </el-table-column> -->
      <!-- <el-table-column
        prop="freezingTime"
        label="冻结时间"
        align="center">
      </el-table-column> -->
      <!-- <el-table-column
        prop="adminId"
        align="center"
        label="管理员ID">
      </el-table-column> -->
      <!-- <el-table-column
        prop="registerTime"
        label="注册时间"
        align="center">
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        v-if="isWrite === 'isWriteQweasd'"
      >
        <template slot-scope="scope">
          <div class="caozuo">
            <el-link @click="showUserDialogBtn(scope.row)">详情</el-link>
            <!-- <el-link @click="showAddDialogBtn(scope.row)">修改</el-link> -->
            <el-link @click="freezeBtn(scope.row)" v-if="scope.row.state === 0"
              >封号</el-link
            >
            <el-link @click="freezeBtn(scope.row)" v-else>解封</el-link>
            <delete-btn @delinfobtn="delinfobtn(scope.row)"></delete-btn>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userListParams.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="userListParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal"
    >
    </el-pagination>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imageDialog" width="40%">
      <img :src="$imgUrl + imageUrl" class="imgSmall" />
    </el-dialog>
    <!-- 添加修改用户 -->
    <el-dialog
      :title="userTitle"
      :visible.sync="addUserDialog"
      width="60%"
      :close-on-click-modal="false"
      @close="$refs.children.$refs.addUserRef.clearValidate()"
    >
      <add-user :addUser="addUser" ref="children" :userTitle="userTitle">
      </add-user>
      <span slot="footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户详情 -->
    <el-dialog title="用户详情" :visible.sync="userInfoDialog" width="500px">
      <el-form label-width="150px" class="showUserInfo">
        <el-form-item label="用户ID">
          <span>{{ userInfo.id }}</span>
        </el-form-item>
        <el-form-item label="昵称">
          <span>{{ userInfo.name }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ userInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="余额">
          <span>{{ userInfo.balance }}</span>
        </el-form-item>
        <el-form-item label="直推人数">
          <span>{{ userInfo.directNum }}</span>
        </el-form-item>
        <el-form-item label="团队">
          <span>{{ userInfo.teamNum }}</span>
        </el-form-item>
        <el-form-item label="邀请人">
          <span>{{ userInfo.invitees }}</span>
        </el-form-item>
        <el-form-item label="邀请码">
          <span>{{ userInfo.invitationCode }}</span>
        </el-form-item>
        <el-form-item label="最后登录时间">
          <span>{{ userInfo.recentlyLanded }}</span>
        </el-form-item>
        <el-form-item label="登录密码">
          <span>{{ userInfo.loginPwd }}</span>
        </el-form-item>
        <el-form-item label="支付密码">
          <span>{{ userInfo.paymentPwd }}</span>
        </el-form-item>
        <el-form-item label="注册时间">
          <span>{{ userInfo.registerTime }}</span>
        </el-form-item>
        <el-form-item label="冻结时间">
          <span>{{ userInfo.freezingTime }}</span>
        </el-form-item>
        <el-form-item label="管理员ID">
          <span>{{ userInfo.adminId }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import format from '@/plugins/format.js'
import addUser from '@/components/addUser.vue'
import deleteBtn from '@/components/deleteBtn.vue'
export default {
  components: {
    addUser,
    deleteBtn
  },
  data () {
    return {
      // 搜索参数
      userListParams: {
        id: null,
        name: '',
        gender: '',
        city: '',
        phone: '',
        realName: null,
        registerTimeToday: '',
        grade: '',
        chooseRlTime: '',
        currentPage: 1,
        limit: 10
      },
      allTotal: 0,
      // 具体搜索按钮
      searchBtnValue: [
        { id: 1, value: 'all', name: '所有用户' },
        { id: 2, value: 'realNamey', name: '已认证' },
        { id: 3, value: 'realNamew', name: '未认证' },
        { id: 4, value: 'genderm', name: '男性用户' },
        { id: 5, value: 'genderw', name: '女性用户' },
        { id: 6, value: 'timetoday', name: '今日注册' }
      ],
      // 用户列表数据
      userList: [],
      // 搜索下拉框列表
      searchOptionsList: [
        { value: 'ID' },
        { value: '昵称' },
        { value: '城市' },
        { value: '手机号' },
        { value: '会员等级' }
      ],
      OptionValue: null,
      // 搜索框内容
      searchValue: null,
      activeBtnValue: '',
      // 消息框
      userTitle: '',
      addUserDialog: false,
      addUserModel: {
        name: '',
        gender: '男',
        city: '',
        phone: '',
        balance: '',
        invitees: '',
        invitationCode: '',
        chatGroup: '',
        groupLeader: '',
        grade: '',
        realName: '0',
        state: '0',
        loginPwd: '',
        paymentPwd: '',
        adminId: ''
      },
      addUser: {},
      // 图片预览
      imageUrl: '',
      imageDialog: false,
      // 用户详情
      userInfo: {},
      userInfoDialog: false
    }
  },
  created () {
    this.getUserList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getUserList () {
      console.log(this.userListParams)
      const { data: res } = await this.$http.post(
        '/userTable/selectUserList',
        this.userListParams
      )
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取用户数据失败')
      this.userList = res.data.queryUserListData.pageData
      if (this.userList.length === 0 && this.userListParams.currentPage > 1) {
        this.userListParams.currentPage -= 1
        this.getUserList()
      }
      console.log(this.userList)
      this.allTotal = res.data.queryUserListData.totalCount
    },
    // 查看用户详情
    showUserDialogBtn (value) {
      console.log(value)
      this.userInfo = value
      this.userInfoDialog = true
    },
    // 按钮固定搜索
    allUserList (value) {
      this.activeBtnValue = value
      this.searchValue = null
      this.OptionValue = null
      console.log(value)
      const all = this.userListParams
      all.id = all.realName = null
      all.name = all.gender = all.city = all.phone = all.registerTimeToday = all.chooseRlTime =
        ''
      switch (value) {
        case 'all':
          this.activeBtnValue = ''
          break
        case 'realNamey':
          all.realName = 1
          break
        case 'realNamew':
          all.realName = 0
          break
        case 'genderm':
          all.gender = '男'
          break
        case 'genderw':
          all.gender = '女'
          break
        case 'timetoday':
          all.registerTimeToday = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
          break
        default:
          all.chooseRlTime = value
      }
      console.log(this.userListParams)
      this.getUserList()
    },
    // 下拉框选择搜索
    seacrchOptionBtn () {
      console.log(this.OptionValue)
      console.log(this.searchValue)
      const all = this.userListParams
      all.id = null
      all.name = all.city = all.phine = all.grade = ''
      switch (this.OptionValue) {
        case 'ID':
          all.id = parseInt(this.searchValue)
          break
        case '昵称':
          all.name = this.searchValue
          break
        case '城市':
          all.city = this.searchValue
          break
        case '手机号':
          all.phone = this.searchValue
          break
        case '会员等级':
          all.grade = this.searchValue
          break
        default:
      }
      console.log(this.userListParams)
      this.getUserList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userListParams.limit = val
      this.getUserList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userListParams.currentPage = val
      this.getUserList()
    },
    // 添加用户按钮
    showAddDialogBtn (value) {
      console.log(value)
      if (value === 'add') {
        this.userTitle = '添加用户'
        this.addUser = JSON.parse(JSON.stringify(this.addUserModel))
      } else {
        this.userTitle = '修改用户'
        this.addUser = value
        this.addUser.realName = this.addUser.realName + ''
        this.addUser.state = this.addUser.state + ''
        // this.changeUserId = value.id
      }
      console.log(this.addUser)
      this.getUserList()
      this.addUserDialog = true
    },
    // 添加修改用户消息框确定按钮
    addUserDialogBtn () {
      console.log(this.addUser)
      if (this.addUser.grade) {
        delete this.addUser.grade
      }
      this.$refs.children.$refs.addUserRef.validate(async (value) => {
        if (!value) return this.$message.error('请输入用户名或手机号')
        if (this.userTitle === '添加用户') {
          if (this.addUserDialog.id) {
            delete this.addUserDialog.id
          }
          const { data: res } = await this.$http.post(
            'userTable/insertUserList',
            this.addUser
          )
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
        } else {
          // this.addUser.id = this.changeUserId
          console.log(this.addUser)
          const { data: res } = await this.$http.post(
            'userTable/updateUserList',
            this.addUser
          )
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功')
        }
        this.getUserList()
        this.addUserDialog = false
      })
    },
    // 删除按钮
    async delinfobtn (value) {
      const { data: res } = await this.$http.post(
        `userTable/delUserList?id=${value.id}`
      )
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 封号
    async freezeBtn (value) {
      console.log(value.state)
      if (value.state === 0) {
        value.state = 1
      } else {
        value.state = 0
      }
      console.log(value.state)
      const { data: res } = await this.$http.post(
        `userTable/banUserList?id=${value.id}&state=${value.state}`
      )
      console.log(res)
      this.getUserList()
    },
    // 图片预览
    lookImg (value) {
      this.imageUrl = value.userImg
      console.log(this.imageUrl)
      this.imageDialog = true
    }
  }
}
</script>

<style lang='less' scoped>
.userlist {
  // 添加用户
  .addUserBtn {
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid;
  }
  // 固定搜索
  .searchBtn {
    margin-top: 10px;
    .activeBtn {
      background-color: #d4e9fe;
      color: #68aaef;
    }
  }
  // 下拉搜索
  .search {
    margin: 10px 0;
    width: 600px;
    display: flex;
    .el-select {
      width: 100px;
    }
    .el-date-editor {
      margin-left: 20px;
    }
  }
  .imgSmall {
    width: 100%;
    cursor: pointer;
  }
  .showUserInfo {
    .el-form-item {
      margin: 0;
    }
    span {
      margin-left: 10px;
    }
  }
  .caozuo {
    display: flex;
    flex-wrap: wrap;
    .el-link {
      margin: auto 3px;
    }
  }
}
</style>
