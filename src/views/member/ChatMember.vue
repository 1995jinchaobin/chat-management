<template>
  <div class="chatmember">
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        clearable
        @clear='closeSelectValue'
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
          :value="item.value"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="seacrchOptionBtn"></el-button>
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
      border
      >
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
      <el-table-column
        align="center"
        prop="groupImageId"
        label="群头像">
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
          <span v-else>已禁言</span>
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
        label="管理">
        <template slot-scope="scope">
          <el-link v-if="scope.row.forbiddenWordsStatus===0" @click="changeStatus(scope.row)">禁言</el-link>
          <el-link v-else @click="changeStatus(scope.row)">解禁</el-link>
          <el-link @click="delbtn(scope.row)">解散</el-link>
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
      ]
    }
  },
  created () {
    this.getChatMemberList()
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
    // 删除按钮
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
      const { data: res } = await this.$http.delete(`groupComment/delete?id=${value.id}&groupNo=${value.groupNo}`)
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
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.chatMemberListParams.currenPage = val
      this.getChatMemberList()
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
          if (this.searchValue.length > 0) {
            all.groupNo = parseInt(this.searchValue)
          } else {
            all.groupNo = null
          }
          break
        case '聊天室名字':
          all.groupName = this.searchValue
          break
        case '群主ID':
          console.log(all.groupMasterId)
          if (this.searchValue.length > 0) {
            all.groupMasterId = parseInt(this.searchValue)
          } else {
            all.groupMasterId = null
          }
          break
        case '群管理员':
          if (this.searchValue.length > 0) {
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
}
</style>
