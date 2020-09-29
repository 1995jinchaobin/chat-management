<template>
  <div class="sysinform">
    <div class="addSysBtn">
      <el-button @click="changeSysInform('add')" type="success" v-if="isWrite==='isWriteQweasd'">添加广播</el-button>
    </div>
    <div class="search">
      <el-input
        v-model="sysInformListParams.informTitle"
        placeholder="请输入标题"
        clearable
        @change="getSysInformList">
      </el-input>
      <el-date-picker
        v-model="sysInformListParams.informTime"
        type="date"
        placeholder="请选择时间"
        value-format="yyyy-MM-dd"
        @change="getSysInformList">
      </el-date-picker>
      <el-button @click="getSysInformList" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="sysInformList"
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
        prop="informTitle"
        label="推送标题">
      </el-table-column>
      <el-table-column
        align="center"
        prop="informComment"
        label="推送内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="informTime"
        label="推送时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link @click="changeSysInform(scope.row)" class="marginRight">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)' :name="name"></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="sysInformListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="sysInformListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加修改广播 -->
    <el-dialog
      :title="sysTitle"
      :visible.sync="sysDialog"
      width="60%"
      :close-on-click-modal='false'>
      <el-form
        ref="addSysRef"
        :model="addSys"
        label-width="150px">
        <el-form-item
          label="系统广播标题">
          <el-input
            v-model="addSys.informTitle"
            placeholder="请输入系统广播标题"
            >
          </el-input>
        </el-form-item>
        <el-form-item
          label="系统广播内容">
          <el-input
            v-model="addSys.informComment"
            placeholder="请输入系统广播内容"
            >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sysDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSysDialogBtn">确 定</el-button>
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
      sysInformListParams: {
        informTitle: '',
        informTime: '',
        currenPage: 1,
        selectCount: 10
      },
      sysInformList: [],
      allTotal: 0,
      // 添加修改广播
      sysTitle: '',
      sysDialog: false,
      addSys: {},
      name: '系统广播'
    }
  },
  created () {
    this.getSysInformList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getSysInformList () {
      console.log(this.sysInformListParams)
      this.sysInformListParams.informTitle = this.sysInformListParams.informTitle.trim()
      const { data: res } = await this.$http.get('informComment/selectAll', { params: this.sysInformListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取系统通知数据失败')
      this.sysInformList = res.data.memberPageData.pageData
      if (this.sysInformList.length === 0 && this.sysInformListParams.currenPage > 1) {
        this.sysInformListParams.currenPage -= 1
        this.getSysInformList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 删除
    async delinfobtn (value) {
      const { data: res } = await this.$http.get(`informComment/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除系统通知失败')
      this.$message.success('删除系统通知成功')
      this.getSysInformList()
    },
    // 修改添加按钮
    changeSysInform (value) {
      if (value === 'add') {
        this.sysTitle = '添加广播'
        this.addSys = {
          informTitle: '',
          informComment: ''
        }
      } else {
        this.sysTitle = '修改广播'
        this.addSys = value
        delete this.addSys.informTime
        this.getSysInformList()
      }
      this.sysDialog = true
    },
    // 确定按钮
    async addSysDialogBtn () {
      console.log(this.addSys)
      if (this.sysTitle === '添加广播') {
        const { data: res } = await this.$http.post('informComment/ins', this.addSys)
        console.log(res)
        if (res.code !== 100) return this.$message.error('添加广播失败')
        this.$message.success('添加广播成功')
      } else {
        const { data: res } = await this.$http.post('informComment/upd', this.addSys)
        console.log(res)
        if (res.code !== 100) return this.$message.error('修改广播失败')
        this.$message.success('修改广播成功')
      }
      this.getSysInformList()
      this.sysDialog = false
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.sysInformListParams.selectCount = val
      this.getSysInformList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.sysInformListParams.currenPage = val
      this.getSysInformList()
    }
  }
}
</script>

<style lang='less' scoped>
.sysinform{
  .addSysBtn{
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .search{
    display: flex;
    margin-bottom: 10px;
    .el-input{
      width: 200px;
      margin-right: 20px;
    }
  }
  .marginRight{
    margin-right: 10px;
  }
}
</style>
