<template>
  <div class="chatmember">
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        clearable
        @clear='seacrchOptionBtn'
        @change="seacrchOptionBtn"
        class="inputsearch">
        <el-select
          v-model="OptionValue"
          slot="prepend"
          placeholder="请选择类型"
          class="selectsearch">
          <el-option
            v-for="item in searchOptionsList"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="seacrchOptionBtn">
        </el-button>
      </el-input>
      <el-date-picker
        v-model="chatMemberListParams.createTime"
        type="date"
        placeholder="时间"
        @change='seacrchOptionBtn'
        value-format="yyyy-MM-dd"
        class="searchtime">
      </el-date-picker>
    </div>
    <el-table
      :data="chatMemberList"
      stripe
      border>
      <el-table-column
        align="center"
        prop="groupNo"
        label="聊天室群号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupName"
        label="聊天室名字">
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupMasterId"
        label="群主ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupAdministrator"
        label="群管理员">
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="groupImageId"
        label="群头像">
      </el-table-column> -->
      <el-table-column
        label="群头像"
        align="center">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.imageUrl" class="imgSmall" @click="lookImg(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupNotice"
        label="群公告">
      </el-table-column>
      <el-table-column
        align="center"
        label="群状态">
        <template slot-scope="scope">
          <span v-if="scope.row.forbiddenWordsStatus===0">可聊天</span>
          <span v-else class="red">已禁言</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupContentFileUrl"
        label="群文件">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link @click="getChatInfoList(scope.row)" class="marginRight">详情</el-link>
          <el-link v-if="scope.row.forbiddenWordsStatus===0" @click="changeStatus(scope.row)">禁言</el-link>
          <el-link v-else @click="changeStatus(scope.row)">解禁</el-link>
          <el-link @click="delbtn(scope.row)" class="marginLeft">解散</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="chatMemberListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="chatMemberListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 群用户详情 -->
    <el-dialog
      :title="titleGroupNo+'群用户详情'"
      :visible.sync="userInfoDialog"
      :close-on-click-modal='false'
      width="70%">
      <el-input
        placeholder="请输入用户id"
        v-model="userInfoParams.userId"
        clearable
        @clear="getChatInfoListSearch"
        class="searchUserId">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getChatInfoListSearch">
        </el-button>
      </el-input>
      <el-table
        :data="infoData"
        stripe
        border>
        <el-table-column
          align="center"
          prop="userId"
          label="用户ID">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          align="center"
          prop="city"
          label="城市">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.forbiddenWordsStatus===0">正常</span>
            <span class="red" v-else>禁言</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="管理">
          <template slot-scope="scope">
            <el-link v-if="scope.row.forbiddenWordsStatus===0" @click="userInfoStatusChange(scope.row,1)">禁言</el-link>
            <el-link v-else @click="userInfoStatusChange(scope.row,0)">解禁</el-link>
            <el-link @click="userOutGroup(scope.row)" class="marginLeft" v-if="scope.row.userId!==qunZhuId">移出群</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="userhandleSizeChange"
        @current-change="userhandleCurrentChange"
        :current-page="userInfoParams.currenPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="userInfoParams.selectCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userAllTotal">
      </el-pagination>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imageDialog"
      width="40%">
      <img :src="$imgUrl+imageUrl" class="imgSmall"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chatMemberListParams: {
        groupNo: null,
        groupName: '',
        groupMasterId: null,
        groupAdministrator: null,
        forbiddenWordsStatus: null,
        createTime: '',
        currenPage: 1,
        selectCount: 10
      },
      chatMemberList: [],
      allTotal: 0,
      // 搜索
      searchValue: '',
      OptionValue: '',
      searchOptionsList: [
        { value: '聊天室群号' },
        { value: '聊天室名字' },
        { value: '群主ID' },
        { value: '群管理员' }
      ],
      // 图片预览
      imageUrl: '',
      imageDialog: false,
      // 群用户详情
      infoData: [],
      userInfoDialog: false,
      titleGroupNo: '',
      userInfoParams: {
        currenPage: 1,
        selectCount: 10,
        userId: null,
        groupNo: null
      },
      userAllTotal: null,
      qunZhuId: null
    }
  },
  created () {
    this.getChatMemberList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getChatMemberList () {
      const { data: res } = await this.$http.get('groupComment/pageSelect', { params: this.chatMemberListParams })
      console.log(res)
      this.chatMemberList = res.data.pageDate.pageData
      if (this.chatMemberList.length === 0 && this.chatMemberListParams.currenPage > 1) {
        this.chatMemberListParams.currenPage -= 1
        this.getBlackList()
      }
      this.allTotal = res.data.pageDate.totalCount
    },
    // 解散
    async delbtn (value) {
      const confirmRes = await this.$confirm(`此操作将解散群:${value.groupNo},是否继续`, '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.delete(`groupComment/delete?id=${value.id}&groupNo=${value.groupNo}&groupMasterId=${value.groupMasterId}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('解散失败')
      this.$message.success('解散成功')
      this.getChatMemberList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.chatMemberListParams.selectCount = val
      this.getChatMemberList()
    },
    // 群用户详情每页条数变化
    userhandleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userInfoParams.selectCount = val
      this.getChatInfoList()
    },
    // 群用户详情
    async getChatInfoList (value) {
      console.log(value)
      if (value) {
        this.qunZhuId = value.groupMasterId
        this.userInfoParams.groupNo = value.groupNo
        this.titleGroupNo = value.groupNo
      }
      console.log(this.qunZhuId)
      console.log(this.userInfoParams)
      const { data: res } = await this.$http.get('groupComment/groupInfo', { params: this.userInfoParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取群用户详情失败')
      this.infoData = res.data.infoData.pageData
      if (this.infoData.length === 0 && this.userInfoParams.currenPage > 1) {
        this.userInfoParams.currenPage -= 1
        this.getChatInfoList()
      }
      this.userAllTotal = res.data.infoData.totalCount
      this.userInfoDialog = true
    },
    // 群用户禁言
    async userInfoStatusChange (value, a) {
      console.log(value)
      console.log(a)
      const params = {
        userId: value.userId,
        groupNo: this.titleGroupNo,
        status: a
      }
      const { data: res } = await this.$http.post('groupContentTable/forbiddenWords', params)
      if (a === 1 && res.code !== 100) {
        return this.$message.error('禁言失败')
      } else if (a === 1 && res.code === 100) {
        this.$message.success('禁言成功')
      } else if (a === 0 && res.code !== 100) {
        return this.$message.error('解禁失败')
      } else {
        this.$message.success('解禁成功')
      }
      this.getChatInfoList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.chatMemberListParams.currenPage = val
      this.getChatMemberList()
    },
    // 群用户详情页数变化
    userhandleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userInfoParams.currenPage = val
      this.getChatInfoList()
    },
    // 群禁言切换
    async changeStatus (value) {
      // id，forbiddenWordsStatus
      const change = {
        id: value.id,
        forbiddenWordsStatus: value.forbiddenWordsStatus
      }
      if (change.forbiddenWordsStatus === 0) {
        change.forbiddenWordsStatus = 1
      } else {
        change.forbiddenWordsStatus = 0
      }
      const { data: res } = await this.$http.post('groupComment//update', change)
      console.log(res)
      if (res.code !== 100) return this.$message.error('切换群状态失败')
      this.$message.success('切换群状态成功')
      this.getChatMemberList()
    },
    // 下拉框搜索
    seacrchOptionBtn () {
      console.log(this.OptionValue)
      console.log(this.searchValue)
      const all = this.chatMemberListParams
      all.groupNo = all.groupMasterId = all.groupAdministrator = all.forbiddenWordsStatus = null
      all.groupName = ''
      switch (this.OptionValue) {
        case '聊天室群号':
          if (parseInt(this.searchValue)) {
            all.groupNo = parseInt(this.searchValue)
          } else {
            all.groupNo = null
          }
          break
        case '聊天室名字':
          all.groupName = this.searchValue.trim()
          break
        case '群主ID':
          console.log(all.groupMasterId)
          if (parseInt(this.searchValue)) {
            all.groupMasterId = parseInt(this.searchValue)
          } else {
            all.groupMasterId = null
          }
          break
        case '群管理员':
          if (parseInt(this.searchValue)) {
            all.groupAdministrator = parseInt(this.searchValue)
          } else {
            all.groupAdministrator = null
          }
          break
        default:
      }
      console.log(this.chatMemberListParams)
      this.getChatMemberList()
    },
    // 清空搜索内容
    closeSelectValue () {
      this.OptionValue = this.searchValue = ''
      this.getChatMemberList()
    },
    // 图片预览
    lookImg (value) {
      this.imageUrl = value.imageUrl
      console.log(this.imageUrl)
      this.imageDialog = true
    },
    // 把用户移出群
    async userOutGroup (value) {
      console.log(this.titleGroupNo)
      console.log(value.userId)
      const confirmRes = await this.$confirm('此操作将移出用户,是否继续', '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const userParams = {
        group: this.titleGroupNo,
        userId: value.userId
      }
      const { data: res } = await this.$http.get('groupContentTable/delectyc', { params: userParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('移出群聊失败')
      this.$message.success('移出群聊成功')
      this.getChatInfoList()
    },
    // 用户搜索
    getChatInfoListSearch () {
      this.getChatInfoList()
    }
  }
}
</script>

<style lang='less' scoped>
.chatmember{
  .search{
    display: flex;
    margin-bottom: 10px;
    .inputsearch{
      width: 450px;
      margin-right: 20px;
      .selectsearch{
        width: 160px;
      }
    }
    .searchtime{
      width: 150px;
    }
  }
  .imgSmall{
    width: 100%;
    cursor: pointer;
  }
  .searchUserId{
    width: 40%;
    margin-bottom: 10px;
  }
}
</style>
