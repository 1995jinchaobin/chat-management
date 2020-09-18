<template>
  <div class="site">
    <div class="addSite">
      <el-button @click="changeSiteInfo('add')" type="success">添加标签</el-button>
    </div>
    <el-table
      :data="siteList"
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
        prop="labelName"
        label="标签名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="labelType"
        label="分类">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.labelStatus===0" class="red">已禁用</span>
          <span v-else>已启用</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理">
        <template slot-scope="scope">
          <el-link @click="changeSiteInfo(scope.row)" class="changebtn">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="siteListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="siteListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addSiteDialog"
      width="60%"
      :close-on-click-modal='false'>
      <el-form
        ref="addSiteRef"
        :model="addSite"
        label-width="150px">
        <el-form-item
          label="标签名">
          <el-input
            v-model="addSite.labelName"
            placeholder="请输入用户ID"
            >
          </el-input>
        </el-form-item>
        <el-form-item
          label="标签分类">
          <el-radio v-model="addSite.labelType" label="通用">通用</el-radio>
          <el-radio v-model="addSite.labelType" label="男性">男性</el-radio>
          <el-radio v-model="addSite.labelType" label="女性">女性</el-radio>
        </el-form-item>
        <el-form-item
          label="状态">
          <el-radio v-model="addSite.labelStatus" label="0">禁用</el-radio>
          <el-radio v-model="addSite.labelStatus" label="1">启用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addSiteDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSiteDialogBtn">确 定</el-button>
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
    return {
      siteListParams: {
        currenPage: 1,
        selectCount: 10
      },
      siteList: [],
      allTotal: 0,
      // 修改添加标签
      dialogTitle: '',
      addSiteDialog: false,
      addSite: {}
      // addSiteRule: {
      //   userId: [
      //     { required: true, message: '请输入用户ID', trigger: 'blur' }
      //   ],
      //   name: [
      //     { required: true, message: '请输入会员组名称', trigger: 'blur' }
      //   ]
      // }
    }
  },
  created () {
    this.getSiteList()
  },
  methods: {
    async getSiteList () {
      console.log(this.siteListParams)
      const { data: res } = await this.$http.get('labelDic/selectAll', { params: this.siteListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取聊天室数据失败')
      this.siteList = res.data.memberPageData.pageData
      if (this.siteList.length === 0 && this.siteListParams.currenPage > 1) {
        this.siteListParams.currenPage -= 1
        this.getSiteList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 删除
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.get(`labelDic/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除标签失败')
      this.$message.success('删除标签成功')
      this.getSiteList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.siteListParams.selectCount = val
      this.getSiteList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.siteListParams.currenPage = val
      this.getSiteList()
    },
    // 打开消息框
    changeSiteInfo (value) {
      console.log(value)
      if (value === 'add') {
        this.dialogTitle = '添加标签'
        this.addSite = {
          labelStatus: '1',
          labelType: '通用',
          labelName: ''
        }
      } else {
        value.labelStatus = value.labelStatus + ''
        this.dialogTitle = '修改标签'
        this.addSite = value
      }
      this.getSiteList()
      this.addSiteDialog = true
    },
    // 消息框确定
    async addSiteDialogBtn () {
      this.addSite.labelStatus = parseFloat(this.addSite.labelStatus)
      console.log(this.addSite)
      if (this.dialogTitle === '修改标签') {
        const { data: res } = await this.$http.post('labelDic/upd', this.addSite)
        console.log(res)
        if (res.code !== 100) return this.$message.error('修改标签失败')
        this.$message.success('修改标签成功')
      } else {
        console.log(this.addSite)
        const { data: res } = await this.$http.post('labelDic/add', this.addSite)
        console.log(res)
        if (res.code !== 100) return this.$message.error('添加标签失败')
        this.$message.success('添加标签成功')
      }
      this.getSiteList()
      this.addSiteDialog = false
    }
  }
}
</script>

<style lang='less' scoped>
.site{
  .addSite{
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .red{
    color: red;
  }
  .changebtn{
    margin-right: 10px;
  }
}
</style>
