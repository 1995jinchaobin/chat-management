<template>
  <div class="admin">
    <div class="addadmin">
      <el-button type="success" @click="addAdminBtn('add')" v-if="isWrite==='isWriteQweasd'">添加管理员</el-button>
    </div>
    <el-table
      :data="adminList"
      stripe
      border
      >
      <el-table-column
        align="center"
        prop="id"
        label="id">
      </el-table-column>
      <el-table-column
        align="center"
        prop="adminName"
        label="账户">
      </el-table-column>
      <el-table-column
        align="center"
        prop="adminType"
        label="管理员类别">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">正常</span>
          <span v-else class="red">冻结</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="time"
        label="修改时间">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link @click="addAdminBtn(scope.row)" class="changeadmin">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="adminListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="adminListParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加修改用户 -->
    <el-dialog
      :title="adminTitle"
      :visible.sync="adminDialog"
      width="60%"
      :close-on-click-modal='false'
      @close=$refs.adminRef.clearValidate()>
      <el-form
        ref="adminRef"
        :model="adminInfo"
        :rules="adminInfoRule"
        label-width="150px">
        <el-form-item
          label="管理员账号"
          prop="adminName">
          <el-input
            v-model="adminInfo.adminName"
            placeholder="请输入管理员账户名"
            :disabled="adminTitle==='修改管理员'"></el-input>
        </el-form-item>
        <el-form-item
          label="管理员密码"
          prop="adminPwd"
          v-if="adminTitle==='添加管理员'">
          <el-input v-model="adminInfo.adminPwd" placeholder="请输入管理员密码"></el-input>
        </el-form-item>
        <el-form-item
          label="权限类别">
          <el-select
            v-model="adminInfo.adminType"
            placeholder="请选择管理员权限">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.adminType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账户状态">
          <el-radio v-model="adminInfo.status" :label=0>正常</el-radio>
          <el-radio v-model="adminInfo.status" :label=1>冻结</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="adminDialog = false">取 消</el-button>
        <el-button type="primary" @click="adminDialogBtn">确 定</el-button>
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
      if (this.adminTitle === '修改管理员') {
        callback()
      }
      if (value === '') return callback(new Error('请输入管理员账号'))
      await this.getAdminrname()
      if (this.code !== 100) {
        callback(new Error('管理员账号已存在'))
      } else if (this.code === 100) {
        callback()
      }
    }
    return {
      // 获取数据
      adminListParams: {
        currentPage: 1,
        limit: 10
      },
      adminList: [],
      allTotal: 0,
      // 管理员权限分类列表
      statusList: [],
      statusValue: null,
      // 消息框
      adminTitle: '',
      adminDialog: false,
      adminInfo: {},
      adminInfoMudol: {
        adminType: null,
        adminPwd: '',
        adminName: '',
        status: 0
      },
      adminInfoRule: {
        adminName: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        adminPwd: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' }
        ]
      },
      code: null
    }
  },
  created () {
    this.getAdminList()
    this.getAdminPowerList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    // 管理员权限分类列表
    async getAdminPowerList () {
      const { data: res } = await this.$http.get('adminList/selectAdminTypeList')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取权限类别失败')
      this.statusList = res.data.adminTypeList
      console.log(this.statusList)
    },
    async getAdminList () {
      const { data: res } = await this.$http.get('adminList/selectAdminList', { params: this.adminListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取权限类别列表失败')
      this.adminList = res.data.queryAdminListData.pageData
      if (this.adminList.length === 0 && this.adminListParams.currentPage > 1) {
        this.adminListParams.currentPage -= 1
        this.getAdminList()
      }
      this.allTotal = res.data.queryAdminListData.totalCount
    },
    // 删除
    async delinfobtn (value) {
      const { data: res } = await this.$http.delete(`adminList/deleteAdmin?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除管理员失败')
      this.$message.success('删除管理员成功')
      this.getAdminList()
    },
    // 增加管理员
    addAdminBtn (value) {
      if (value === 'add') {
        this.adminTitle = '添加管理员'
        this.adminInfo = JSON.parse(JSON.stringify(this.adminInfoMudol))
      } else {
        console.log(value)
        this.adminInfo = value
        this.adminTitle = '修改管理员'
        if (typeof this.adminInfo.adminType === 'string') {
          console.log(this.adminInfo.adminType)
          // this.statusList.indexOf(item => {
          //   item.adminType === this.adminInfo.adminType
          // })
          // this.adminInfo.adminType =
          for (var obj of this.statusList) {
            if (obj.adminType === this.adminInfo.adminType) { this.adminInfo.adminType = obj.id }
          }
        }
        this.getAdminList()
      }
      this.adminDialog = true
    },
    async getAdminrname () {
      const { data: res } = await this.$http.get(`adminList/checkAdminName?adminName=${this.adminInfo.adminName}`)
      console.log(res)
      this.code = res.code
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.adminListParams.limit = val
      this.getAdminList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.adminListParams.currentPage = val
      this.getAdminList()
    },
    // 消息框确定按钮
    async adminDialogBtn () {
      console.log(this.adminInfo)
      if (this.adminInfo.adminType === null) return this.$message.error('请选择权限类别')
      this.$refs.adminRef.validate(async value => {
        if (!value) return
        if (this.adminTitle === '添加管理员') {
          const { data: res } = await this.$http.post('adminList/insertAdminList', this.adminInfo)
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加管理员失败')
          this.$message.success('添加管理员成功')
        } else {
          delete this.adminInfo.time
          delete this.adminInfo.adminName
          console.log(this.adminInfo)
          const { data: res } = await this.$http.post('adminList/updateAdminList', this.adminInfo)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改管理员信息失败')
          this.$message.success('修改管理员信息成功')
        }
        this.getAdminList()
        this.adminDialog = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.admin{
  .addadmin{
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #000;
  }
  .el-select{
    width: 100%;
  }
  .el-radio{
    margin-left: 20px;
  }
  .changeadmin{
    margin-right: 10px;
  }
}
</style>
