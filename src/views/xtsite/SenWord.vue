<template>
  <div class="senword">
    <div class="addsenword">
      <el-button @click="addCenWordBtn('add')" type="success">添加敏感词</el-button>
    </div>
    <el-table
      :data="senWordList"
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
        prop="sensitiveWord"
        label="敏感词">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.sensitiveStatus===0" class="red">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理">
        <template slot-scope="scope">
          <el-link @click="addCenWordBtn(scope.row)" class="changesenword">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="senWordListParams.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="senWordListParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加修改敏感词 -->
    <el-dialog
      :title="senWordTitle"
      :visible.sync="senWordDialog"
      width="60%"
      :close-on-click-modal='false'
      @close=$refs.senWordRef.clearValidate()>
      <el-form
        ref="senWordRef"
        :model="senWordInfo"
        :rules="senWordInfoRule"
        label-width="150px">
        <el-form-item
          label="敏感词"
          prop="sensitiveWord">
          <el-input
            v-model="senWordInfo.sensitiveWord"
            placeholder="请输入敏感词"></el-input>
        </el-form-item>
        <el-form-item
          label="敏感词状态">
          <el-radio v-model="senWordInfo.sensitiveStatus" :label=0>禁用</el-radio>
          <el-radio v-model="senWordInfo.sensitiveStatus" :label=1>启用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="asenWordDialog = false">取 消</el-button>
        <el-button type="primary" @click="senWordDialogBtn">确 定</el-button>
      </span>
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
    var validatePass = async (rule, value, callback) => {
      if (value === '') return callback(new Error('请输入敏感词'))
      await this.getSenWordRule()
      if (this.code !== 100) {
        callback(new Error('敏感词已存在'))
      } else if (this.code === 100) {
        callback()
      }
    }
    return {
      senWordListParams: {
        currentPage: 1,
        limit: 10,
        sensitiveWord: ''
      },
      senWordList: [],
      allTotal: 0,
      // 消息框
      senWordTitle: '',
      senWordDialog: false,
      senWordInfo: {},
      senWordInfoMudol: {
        sensitiveWord: '',
        sensitiveStatus: 0
      },
      senWordInfoRule: {
        sensitiveWord: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      code: null
    }
  },
  created () {
    this.getSenWordList()
  },
  methods: {
    async getSenWordList () {
      const { data: res } = await this.$http.get('sensitiveComment/selectSensitiveCommentAll', { params: this.senWordListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取敏感词数据列表失败')
      this.senWordList = res.data.sensitiveCommentListData.pageData
      if (this.senWordList.length === 0 && this.senWordListParams.currentPage > 1) {
        this.senWordListParams.currentPage -= 1
        this.getSenWordList()
      }
      this.allTotal = res.data.sensitiveCommentListData.totalCount
    },
    // 删除
    async delinfobtn (value) {
      console.log(value.id)
      const { data: res } = await this.$http.delete(`sensitiveComment/delSensitiveCommentById?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除管理员失败')
      this.$message.success('删除管理员成功')
      this.getSenWordList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.senWordListParams.limit = val
      this.getSenWordList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.senWordListParams.currentPage = val
      this.getSenWordList()
    },
    // 修改添加按钮
    addCenWordBtn (value) {
      if (value === 'add') {
        this.senWordTitle = '添加敏感词'
        this.senWordInfo = JSON.parse(JSON.stringify(this.senWordInfoMudol))
      } else {
        this.senWordTitle = '修改敏感词'
        this.senWordInfo = value
        this.getSenWordList()
      }
      this.senWordDialog = true
    },
    // 敏感词查重
    async getSenWordRule () {
      const { data: res } = await this.$http.get(`sensitiveComment/checkSensitive?sensitiveWord=${this.senWordInfo.sensitiveWord}`)
      console.log(res)
      this.code = res.code
    },
    // 修改添加消息框确定按钮
    senWordDialogBtn () {
      console.log(this.senWordInfo)
      this.$refs.senWordRef.validate(async value => {
        if (!value) return
        if (this.senWordTitle === '添加敏感词') {
          const { data: res } = await this.$http.post('sensitiveComment/insertSensitiveComment', this.senWordInfo)
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加敏感词失败')
          this.$message.success('添加敏感词成功')
        } else {
          const { data: res } = await this.$http.post('sensitiveComment/updateSensitiveComment', this.senWordInfo)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改敏感词失败')
          this.$message.success('修改敏感词成功')
        }
        this.getSenWordList()
        this.senWordDialog = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.senword{
  .addsenword{
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #000;
  }
  .changesenword{
    margin-right: 10px;
  }
  .red{
    color: red;
  }
}
</style>
