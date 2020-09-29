<template>
  <div class="blacklist">
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        clearable
        @clear='seacrchOptionBtn'
        class="inputsearch"
        @change="seacrchOptionBtn">
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
        v-model="blackListParams.time"
        type="date"
        placeholder="时间"
        @change='seacrchOptionBtn'
        value-format="yyyy-MM-dd"
        class="searchtime">
      </el-date-picker>
    </div>
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
        label="拉黑用户头像">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.userImage" class="imgSmall" @click="lookImg(scope.row,'userImage')"/>
        </template>
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
        label="被拉黑用户头像">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.blockImage" class="imgSmall" @click="lookImg(scope.row,'blockImage')"/>
        </template>
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
        label="操作"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)' :name="name"></delete-btn>
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
      ],
      imageUrl: '',
      imageDialog: false,
      name: '拉黑记录'
    }
  },
  created () {
    this.getBlackList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
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
          if (parseInt(this.searchValue)) {
            all.userId = parseInt(this.searchValue)
          } else {
            all.userId = null
          }
          break
        case '拉黑用户手机号':
          all.userPhone = this.searchValue
          break
        case '被拉黑用户ID':
          if (parseInt(this.searchValue)) {
            all.blockId = parseInt(this.searchValue)
          } else {
            all.blockId = null
          }
          break
        case '被拉黑用户手机号':
          all.blockPhone = this.searchValue
          break
        default:
      }
      console.log(this.blackListParams)
      this.getBlackList()
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
    },
    // 图片预览
    lookImg (value, img) {
      console.log(value)
      console.log(img)
      if (img === 'userImage') {
        this.imageUrl = value.userImage
      } else {
        this.imageUrl = value.blockImage
      }
      console.log(this.imageUrl)
      this.imageDialog = true
    }
  }
}
</script>

<style lang='less' scoped>
.blacklist{
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
}
</style>
