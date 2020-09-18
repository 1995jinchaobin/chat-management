<template>
  <div class="blacklist">
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
        :value="item.value"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="seacrchOptionBtn"></el-button>
    </el-input>
    <el-date-picker
      v-model="blackListParams.time"
      type="date"
      placeholder="时间"
      @change='seacrchOptionBtn'
      value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-table
      :data="blackList"
      stripe
      border
      >
      <el-table-column
        align="center"
        prop="userId"
        label="拉黑用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userImage"
        label="拉黑用户头像">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userPhone"
        label="拉黑用户手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="blockId"
        label="被拉黑用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="blockImage"
        label="被拉黑用户头像">
      </el-table-column>
      <el-table-column
        align="center"
        prop="blockPhone"
        label="被拉黑用户手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="time"
        label="时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="blackListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="blackListParams.selectCount"
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
      blackListParams: {
        userPhone: '',
        blockPhone: '',
        userId: null,
        blockId: null,
        time: '',
        currenPage: 1,
        selectCount: 10
      },
      blackList: [],
      allTotal: 0,
      // 搜索
      searchValue: '',
      OptionValue: '',
      searchOptionsList: [
        { value: '拉黑用户ID' },
        { value: '拉黑用户手机号' },
        { value: '被拉黑用户ID' },
        { value: '被拉黑用户手机号' }
      ]
    }
  },
  created () {
    this.getBlackList()
  },
  methods: {
    async getBlackList () {
      const { data: res } = await this.$http.get('blackTable/selectAll', { params: this.blackListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取拉黑数据失败')
      this.blackList = res.data.memberPageData.pageData
      if (this.blackList.length === 0 && this.blackListParams.currenPage > 1) {
        this.blackListParams.currenPage -= 1
        this.getBlackList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 下拉框搜索
    seacrchOptionBtn () {
      console.log(this.OptionValue)
      console.log(this.searchValue)
      const all = this.blackListParams
      all.userId = all.blockId = null
      all.userPhone = all.blockPhone = ''
      switch (this.OptionValue) {
        case '拉黑用户ID':
          all.userId = parseInt(this.searchValue)
          break
        case '拉黑用户手机号':
          all.userPhone = this.searchValue
          break
        case '被拉黑用户ID':
          all.blockId = parseInt(this.searchValue)
          break
        case '被拉黑用户手机号':
          all.blockPhone = this.searchValue
          break
        default:
      }
      console.log(this.blackListParams)
      this.getBlackList()
    },
    // 清空搜索内容
    closeSelectValue () {
      this.OptionValue = this.searchValue = ''
      this.seacrchOptionBtn()
    },
    // 删除
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.get(`blackTable/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除拉黑记录失败')
      this.$message.success('删除拉黑记录成功')
      this.getBlackList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.blackListParams.selectCount = val
      this.getBlackList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.blackListParams.currenPage = val
      this.getBlackList()
    }
  }
}
</script>

<style>

</style>
