<template>
  <div class="chatroom">
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        clearable
        @clear='closeSelectValue'
        class="searchinput">
        <el-select
          v-model="OptionValue"
          slot="prepend"
          placeholder="请选择类型">
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
        class="searchtime"
        v-model="chatRoomListParams.time"
        type="date"
        placeholder="时间"
        @change='seacrchOptionBtn'
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <el-table
      :data="chatRoomList"
      stripe
      border
      >
      <el-table-column
        align="center"
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userId"
        label="发送用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="发送用户手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="group"
        label="接收聊天室">
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="time"
        label="时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理">
        <template slot-scope="scope">
          <el-link @click="changeBtn('删除该信息','1',scope.row)">撤回</el-link>
          <el-link @click="changeBtn(`使用户:${scope.row.userId}移出群:${scope.row.group}`,'2',scope.row)">移出群</el-link>
          <el-link @click="changeBtn(`使用户:${scope.row.userId}禁言`,'3',scope.row)">禁言</el-link>
          <el-link @click="changeBtn(`使群:${scope.row.group}消息清空`,'4',scope.row)">一键清空</el-link>
        </template>
      </el-table-column>
     </el-table>
     <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="chatRoomListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="chatRoomListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chatRoomListParams: {
        phone: '',
        userId: null,
        content: '',
        time: '',
        currenPage: 1,
        selectCount: 10
      },
      chatRoomList: [],
      allTotal: 0,
      // 搜索
      searchValue: '',
      OptionValue: '',
      searchOptionsList: [
        { value: '用户ID' },
        { value: '用户手机号' },
        { value: '内容' }
      ]
    }
  },
  created () {
    this.getChatRoomList()
  },
  methods: {
    async getChatRoomList () {
      const { data: res } = await this.$http.get('groupContentTable/selectAll', { params: this.chatRoomListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取聊天室数据失败')
      this.chatRoomList = res.data.memberPageData.pageData
      if (this.chatRoomList.length === 0 && this.chatRoomListParams.currenPage > 1) {
        this.chatRoomListParams.currenPage -= 1
        this.getChatRoomList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 下拉框搜索
    seacrchOptionBtn () {
      console.log(this.OptionValue)
      console.log(this.searchValue)
      const all = this.chatRoomListParams
      all.userId = null
      all.phone = all.content = ''
      switch (this.OptionValue) {
        case '用户ID':
          all.userId = parseInt(this.searchValue)
          break
        case '用户手机号':
          all.phone = this.searchValue
          break
        case '内容':
          all.content = this.searchValue
          break
        default:
      }
      console.log(this.chatRoomListParams)
      this.getChatRoomList()
    },
    // 清空搜索内容
    closeSelectValue () {
      this.OptionValue = this.searchValue = ''
      this.getChatRoomList()
    },
    // 管理操作消息提示
    async changeBtn (value, num, row) {
      console.log(num)
      const confirmRes = await this.$confirm(`此操作将${value},是否继续`, '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      if (num === '1') this.chehui(row.id)
      if (num === '2') this.yichuqun(row)
      if (num === '3') this.jinyan(row)
      if (num === '4') this.qingkong(row)
      this.getChatRoomList()
    },
    // 撤回
    async chehui (id) {
      const { data: res } = await this.$http.get(`groupContentTable/del?id=${id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除该信息失败')
      this.$message.success('删除该消息成功')
    },
    // 移除群
    async yichuqun (value) {
      console.log(value)
      const { data: res } = await this.$http.get(`groupContentTable/delectyc?group=${value.group}&userId=${value.userId}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('移出失败')
      this.$message.success('移出成功')
    },
    // 禁言
    async jinyan (value) {
      console.log(value)
      const { data: res } = await this.$http.post('groupContentTable/forbiddenWords', { userId: value.userId })
      if (res.code !== 100) return this.$message.error('禁言失败')
      this.$message.success('禁言成功')
      console.log(res)
    },
    // 一键清空
    async qingkong (value) {
      const { data: res } = await this.$http.get(`groupContentTable/delete?group=${value.group}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('清空失败')
      this.chatRoomListParams.currenPage = 1
      this.$message.success('清空成功')
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.chatRoomListParams.selectCount = val
      this.getChatRoomList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.chatRoomListParams.currenPage = val
      this.getChatRoomList()
    }
  }
}
</script>

<style lang='less' scoped>
.chatroom{
  .search{
    display: flex;
    margin-bottom: 20px;
    .searchinput{
      width: 400px;
      margin-right: 20px;
      .el-select{
      width: 130px;
      }
    }
    .searchtime{
      width: 180px;
    }
  }
}
</style>
