<template>
<div class="contentlist">
  <div class="addCont">
    <el-button
      type="success"
      @click="addContentDialog=true"
      class="addContent">添加广播
    </el-button>
  </div>
  <el-input
    placeholder="请输入内容"
    v-model="contentListParams.content"
    clearable
    @clear='getContentList'
    class="search">
    <el-button
      slot="append"
      icon="el-icon-search"
      @click="getContentList">
    </el-button>
  </el-input>
  <el-table
    :data="contentList"
    stripe
    border
    >
    <el-table-column
      align="center"
      prop="userId"
      label="用户ID">
    </el-table-column>
    <el-table-column
      align="center"
      prop="publishingUsers"
      label="用户昵称">
    </el-table-column>
    <el-table-column
      align="center"
      prop="content"
      label="内容">
    </el-table-column>
    <el-table-column
      align="center"
      prop="time"
      label="发布时间">
    </el-table-column>
    <el-table-column
      align="center"
      prop="type"
      label="发布类型">
    </el-table-column>
    <el-table-column
      align="center"
      label="验证状态">
      <template slot-scope="scope">
        <span v-if="scope.row.state===0" class="red">未通过</span>
        <span v-else>已通过</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="操作">
      <template slot-scope="scope">
        <el-link v-if="scope.row.state===0" @click="changeState(scope.row)">通过</el-link>
        <el-link v-else @click="changeState(scope.row)">拒绝</el-link>
        <delete-btn @delinfobtn='delinfobtn(scope.row)' class="delbtn"></delete-btn>
      </template>
    </el-table-column>
  </el-table>
  <!-- 底部分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="contentListParams.currenPage"
    :page-sizes="[5, 10, 20, 50]"
    :page-size="contentListParams.selectCount"
    layout="total, sizes, prev, pager, next, jumper"
    :total="allTotal">
  </el-pagination>
  <!-- 添加广播 -->
  <el-dialog
    title="添加广播"
    :visible.sync="addContentDialog"
    width="60%"
    :close-on-click-modal='false'
    @close='$refs.addContentRef.resetFields()'>
    <el-form
      ref="addContentRef"
      :model="addContentParams"
      :rules="addContentParamsRules"
      label-width="150px">
      <el-form-item
        label="发布用户ID"
        prop="userId">
        <el-input v-model="addContentParams.userId" placeholder="请输入发布用户昵ID"></el-input>
      </el-form-item>
      <el-form-item
        label="发布用户昵称"
        prop="publishingUsers">
        <el-input v-model="addContentParams.publishingUsers" placeholder="请输入发布用户昵称"></el-input>
      </el-form-item>
      <el-form-item
        label="内容"
        prop="content">
        <el-input v-model="addContentParams.content" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="发布类型"
        prop="type">
        <el-input v-model="addContentParams.type" placeholder="请输入发布类型"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="addContentDialog = false">取 消</el-button>
      <el-button type="primary" @click="addContentDialogBtn">确 定</el-button>
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
      contentListParams: {
        content: '',
        currenPage: 1,
        selectCount: 10
      },
      allTotal: 0,
      contentList: [],
      // 添加广播
      addContentDialog: false,
      addContentParams: {
        userId: '',
        publishingUsers: '',
        content: '',
        type: ''
      },
      addContentParamsRules: {
        userId: [
          { required: true, message: '请输入发布用户ID', trigger: 'blur' }
        ],
        publishingUsers: [
          { required: true, message: '请输入发布用户昵称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入发布内容', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入发布类型', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getContentList()
  },
  methods: {
    async getContentList () {
      const { data: res } = await this.$http.get('systemNotification/selectAll', { params: this.contentListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取内容列表失败')
      this.contentList = res.data.memberPageData.pageData
      if (this.contentList.length === 0 && this.contentListParams.currenPage > 1) {
        this.contentListParams.currenPage -= 1
        this.getContentList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.contentListParams.selectCount = val
      this.getContentList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.contentListParams.currenPage = val
      this.getContentList()
    },
    // 添加广播确定
    addContentDialogBtn () {
      console.log(this.addContentParams)
      this.$refs.addContentRef.validate(async value => {
        if (!value) return
        const { data: res } = await this.$http.post('systemNotification/ins', this.addContentParams)
        if (res.code !== 100) return this.$message.error('添加广播失败')
        this.$message.success('添加广播成功')
        this.getContentList()
        this.addContentDialog = false
        console.log(res)
      })
    },
    // 修改状态
    async changeState (value) {
      const a = {
        id: value.id,
        state: null
      }
      if (value.state === 0) {
        a.state = 1
      } else {
        a.state = 0
      }
      console.log(a)
      const { data: res } = await this.$http.post('systemNotification/upd', a)
      if (res.code !== 100) return this.$message.error('修改状态失败')
      this.$message.success('修改状态成功')
      this.getContentList()
      console.log(res)
      console.log(value.state)
    },
    // 删除内容
    async delinfobtn (value) {
      console.log(value.id)
      const { data: res } = await this.$http.post('systemNotification/del', { id: value.id })
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除内容失败')
      this.$message.success('删除内容成功')
      this.getContentList()
    }
  }
}
</script>

<style lang='less' scoped>
.contentlist{
  .addCont{
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
    .addContent{
      margin-bottom: 10px;
    }
  }
  .search{
    width: 280px;
    margin-bottom: 10px;
  }
  .red{
    color: red;
  }
  .delbtn{
    margin-left: 10px;
  }
}
</style>
