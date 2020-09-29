<template>
  <div class="complaintlist">
    <div class="search">
      <el-input
        class="userid"
        placeholder="请输入用户ID"
        v-model="tousuListParams.userId"
        clearable
        @change="searchBtn">
      </el-input>
      <el-input
        class="complaintContent"
        placeholder="请输入投诉内容"
        v-model="tousuListParams.complaintContent"
        clearable
        @change="searchBtn">
      </el-input>
      <el-select
        class="complaintStatus"
        v-model="tousuListParams.status"
        slot="prepend"
        placeholder="投诉处理状态"
        clearable
        @change="searchBtn">
        <el-option
          v-for="item in searchOptionsList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        class="complaintTime"
        v-model="tousuListParams.complaintTime"
        type="date"
        placeholder="时间"
        value-format="yyyy-MM-dd"
        @change="searchBtn">
      </el-date-picker>
      <el-button @click="searchBtn" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tousuList"
      stripe
      border
      >
      <el-table-column
        align="center"
        prop="id"
        label="编号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userId"
        label="用户id">
      </el-table-column>
      <el-table-column
        align="center"
        prop="complaintContent"
        label="投诉内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="complaintReason"
        label="投诉理由">
      </el-table-column>
      <el-table-column
        align="center"
        prop="complaintTime"
        label="投诉时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="responseComment"
        label="回复内容">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0" class="red">处理中</span>
          <span v-else>已处理</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link v-if="scope.row.status===0" @click="changeStatus(scope.row)">处理完成</el-link>
          <el-link v-else @click="changeStatus(scope.row)">取消处理</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)' class="leftMargin" :name='name'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tousuListParams.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="tousuListParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
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
      tousuListParams: {
        userId: null,
        complaintContent: '',
        complaintTime: '',
        status: null,
        currentPage: 1,
        limit: 10
      },
      tousuList: [],
      allTotal: 0,
      searchOptionsList: [
        { value: 0, label: '处理中' },
        { value: 1, label: '已处理' }
      ],
      name: '投诉记录'
    }
  },
  created () {
    this.getTousuList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getTousuList () {
      const { data: res } = await this.$http.get('complaintComment/selectComplaintComment', { params: this.tousuListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取投诉列表数据失败')
      this.tousuList = res.data.queryComplaintCommentData.pageData
      if (this.tousuList.length === 0 && this.tousuListParams.currentPage > 1) {
        this.tousuListParams.currentPage -= 1
        this.getTousuList()
      }
      this.allTotal = res.data.queryComplaintCommentData.totalCount
    },
    // 删除
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`complaintComment/delComplaintComment?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除投诉数据失败')
      this.$message.success('删除投诉数据成功')
      this.getTousuList()
    },
    // 搜索
    searchBtn () {
      if (parseInt(this.tousuListParams.userId)) {
        this.tousuListParams.userId = parseInt(this.tousuListParams.userId)
        console.log(this.tousuListParams.userId)
      } else {
        this.tousuListParams.userId = null
      }
      this.tousuListParams.complaintContent = this.tousuListParams.complaintContent.trim()
      this.getTousuList()
      console.log(this.tousuListParams)
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.tousuListParams.limit = val
      this.getTousuList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.tousuListParams.currentPage = val
      this.getTousuList()
    },
    // 处理状态切换
    async changeStatus (value) {
      console.log(value.status)
      if (value.status === 0) {
        const a = {
          id: value.id,
          status: 1
        }
        const { data: res } = await this.$http.post('complaintComment/updateStatus', a)
        if (res.code !== 100) return this.$message.error('该投诉处理完成失败')
        this.$message.success('该投诉已处理完成')
      } else {
        const a = {
          id: value.id,
          status: 0
        }
        const { data: res } = await this.$http.post('complaintComment/updateStatus', a)
        if (res.code !== 100) return this.$message.error('该投诉取消处理失败')
        this.$message.success('该投诉已取消处理')
      }
      this.getTousuList()
    }
  }
}
</script>

<style lang='less' scoped>
.complaintlist{
  .search{
    display: flex;
    margin-bottom: 10px;
  }
  .userid{
    width: 150px;
    margin-right: 10px;
  }
  .complaintContent{
    width: 220px;
    margin-right: 10px;
  }
  .complaintStatus{
    width: 150px;
    margin-right: 10px;
  }
  .complaintTime{
    width: 150px;
    margin-right: 10px;
  }
  .red{
    color:red
  }
  .leftMargin{
    margin-left: 10px;
  }
}
</style>
