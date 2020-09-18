<template>
  <div class="complaintlist">
    <!-- complaintContent(投诉内容),complaintTime(投诉时间),status(处理状态(0.处理中 1.已处理)) -->
    <div class="search">
       <el-input
        placeholder="请输入用户ID"
        v-model="tousuListParams.userId"
        clearable>
      </el-input>
      <el-input
        placeholder="请输入投诉内容"
        v-model="tousuListParams.complaintContent"
        clearable>
      </el-input>
      <el-select
        v-model="tousuListParams.status"
        slot="prepend"
        placeholder="请选择投诉处理状态"
        clearable>
        <el-option
          v-for="item in searchOptionsList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="tousuListParams.complaintTime"
        type="date"
        placeholder="时间"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button @click="searchBtn">搜索</el-button>
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
          <span v-if="scope.row.status===0">处理中</span>
          <span v-else>已处理</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
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
      ]
    }
  },
  created () {
    this.getTousuList()
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
      const { data: res } = await this.$http.delete(`complaintComment/delComplaintComment?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除投诉数据失败')
      this.$message.success('删除投诉数据成功')
      this.getTousuList()
    },
    // 搜索
    searchBtn () {
      if (this.tousuListParams.userId !== null && this.tousuListParams.userId.trim().length > 0) {
        this.tousuListParams.userId = parseInt(this.tousuListParams.userId)
        console.log(123)
      } else {
        this.tousuListParams.userId = null
      }
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
    }
  }
}
</script>

<style>

</style>
