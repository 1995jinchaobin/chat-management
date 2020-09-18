<template>
  <div class="userchat">
    <!-- <div class="addContentBtn">
      <el-button type="success" @click=" addContentDialog=true">添加内容</el-button>
    </div> -->
    <el-input
      placeholder="请输入内容"
      v-model="searchValue"
      clearable
      @clear='closeSelectValue'>
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
        @click="seacrchOptionBtn"></el-button>
    </el-input>
    <el-date-picker
      v-model="getContentListParams.time"
      type="date"
      placeholder="时间"
      @change='seacrchOptionBtn'
      value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-table
      :data="contentList"
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
        prop="userPhone"
        label="发送用户手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="聊天内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="receiveId"
        label="接收用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="receivePhone"
        label="接收用户手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="time"
        label="时间">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getContentListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="getContentListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加内容 -->
    <!-- <el-dialog
      title="添加内容"
      :visible.sync="addContentDialog"
      width="60%"
      :close-on-click-modal='false'>
      <span slot="footer">
        <el-button @click="addContentDialog = false">取 消</el-button>
        <el-button type="primary" @click="addContentDialogBtn">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import deleteBtn from '@/components/deleteBtn.vue'
export default {
  components: {
    deleteBtn
  },
  data () {
    return {
      // 查询参数
      getContentListParams: {
        userPhone: '',
        receivePhone: '',
        userId: '',
        receiveId: '',
        content: '',
        time: '',
        currenPage: 1,
        selectCount: 10
      },
      allTotal: 0,
      contentList: [],
      // 搜索参数
      searchValue: '',
      OptionValue: '',
      searchOptionsList: [
        { value: '发送用户ID' },
        { value: '发送用户手机号' },
        { value: '内容' },
        { value: '接收用户ID' },
        { value: '接收用户手机号' }
      ]
      // 添加内容
      // addContentDialog: false
    }
  },
  created () {
    this.getContentList()
  },
  methods: {
    async getContentList () {
      const { data: res } = await this.$http.get('userChatTable/selectAll', { params: this.getContentListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取用户聊天数据失败')
      this.contentList = res.data.memberPageData.pageData
      if (this.contentList.length === 0 && this.getContentListParams.currenPage > 1) {
        this.getContentListParams.currenPage -= 1
        this.getContentList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 下拉框搜索
    seacrchOptionBtn () {
      console.log(this.OptionValue)
      console.log(this.searchValue)
      const all = this.getContentListParams
      all.userId = all.receiveId = null
      all.userPhone = all.content = all.receivePhone = ''
      switch (this.OptionValue) {
        case '发送用户ID':
          all.userId = parseInt(this.searchValue)
          break
        case '发送用户手机号':
          all.userPhone = this.searchValue
          break
        case '内容':
          all.content = this.searchValue
          break
        case '接收用户ID':
          all.receiveId = parseInt(this.searchValue)
          break
        case '接收用户手机号':
          all.receivePhone = this.searchValue
          break
        default:
      }
      console.log(this.getContentListParams)
      this.getContentList()
    },
    // 清空搜索内容
    closeSelectValue () {
      this.OptionValue = this.searchValue = ''
      this.seacrchOptionBtn()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.getContentListParams.selectCount = val
      this.getContentList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.getContentListParams.currenPage = val
      this.getContentList()
    },
    // 删除
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.get(`userChatTable/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除用户聊天内容失败')
      this.$message.success('删除用户聊天内容成功')
      this.getContentList()
    }
    // 添加
    // addContentDialogBtn () {}
  }
}
</script>

<style lang='less' scoped>
.userchat{
  .addContentBtn{
    margin-bottom: 20px;
  }
  .el-input{
    margin-bottom: 20px;
    width: 500px;
    .el-select{
      width: 150px;
    }
  }
  .el-date-editor{
  margin-left: 20px;
  width: 150px;
  }
}
</style>
