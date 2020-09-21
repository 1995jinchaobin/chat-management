<template>
  <div class="level">
    <div class="addLevel">
      <el-button type="success" @click="changeLvevlInfo('add')" v-if="isWrite==='isWriteQweasd'">添加等级</el-button>
    </div>
    <el-table
      :data="levelList"
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
        prop="name"
        label="会员等级名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="directPush"
        label="直推人数">
      </el-table-column>
      <el-table-column
        align="center"
        prop="team"
        label="团队人数">
      </el-table-column>
      <el-table-column
        align="center"
        prop="number"
        label="可建群数量">
      </el-table-column>
      <el-table-column
        align="center"
        prop="groupBuilding"
        label="建群人数">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cost"
        label="建群费用">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link @click="changeLvevlInfo(scope.row)" class="changebtn">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getLevelParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="getLevelParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加修改会员等级 -->
    <el-dialog
      :title="levelTitle"
      :visible.sync="addLevelDialog"
      width="60%"
      :close-on-click-modal='false'
      @close=$refs.children.$refs.addLevelRef.clearValidate()>
      <add-level
        :addLevel='addLevel'
        ref="children"
        :levelTitle='levelTitle'></add-level>
      <span slot="footer">
        <el-button @click="addLevelDialog = false">取 消</el-button>
        <el-button type="primary" @click="addLevelDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addLevel from '@/components/addLevel.vue'
import deleteBtn from '@/components/deleteBtn.vue'
export default {
  components: {
    addLevel,
    deleteBtn
  },
  data () {
    return {
      // 查询
      getLevelParams: {
        currenPage: 1,
        selectCount: 10
      },
      levelList: [],
      allTotal: 0,
      // 添加
      addLevelParams: {
        userId: '',
        name: '',
        directPush: '',
        team: '',
        groupBuilding: '',
        cost: '',
        number: '',
        titleTime: ''
      },
      levelTitle: '',
      addLevelDialog: false,
      addLevel: {}
    }
  },
  created () {
    this.getLevelList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getLevelList () {
      const { data: res } = await this.$http.get('gradeTable/selectAll', { params: this.getLevelParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取会员等级列表数据失败')
      this.levelList = res.data.memberPageData.pageData
      if (this.levelList.length === 0 && this.getLevelParams.currenPage > 1) {
        this.getLevelParams.currenPage -= 1
        this.getLevelList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 修改添加
    changeLvevlInfo (value) {
      if (value === 'add') {
        this.levelTitle = '添加等级'
        this.addLevel = JSON.parse(JSON.stringify(this.addLevelParams))
      } else {
        this.addLevel = value
        this.levelTitle = '修改等级'
      }
      this.getLevelList()
      this.addLevelDialog = true
      console.log(this.addLevel)
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.getLevelParams.selectCount = val
      this.getLevelList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.getLevelParams.currenPage = val
      this.getLevelList()
    },
    // 删除
    async delinfobtn (value) {
      const { data: res } = await this.$http.get(`gradeTable/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除等级失败')
      this.$message.success('删除等级成功')
      this.getLevelList()
    },
    // 修改增加确定按钮
    addLevelDialogBtn () {
      console.log(this.addLevel)
      this.addLevel.directPush = parseFloat(this.addLevel.directPush)
      this.addLevel.team = parseFloat(this.addLevel.team)
      this.addLevel.groupBuilding = parseFloat(this.addLevel.groupBuilding)
      this.addLevel.cost = parseFloat(this.addLevel.cost)
      this.addLevel.number = parseFloat(this.addLevel.number)
      this.addLevel.titleTime = parseFloat(this.addLevel.titleTime)
      this.addLevel.userId = parseFloat(this.addLevel.userId)
      this.$refs.children.$refs.addLevelRef.validate(async value => {
        if (!value) return
        if (this.levelTitle === '修改等级') {
          console.log(this.addLevel)
          const { data: res } = await this.$http.post('gradeTable/upd', this.addLevel)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改等级失败')
          this.$message.success('修改等级成功')
        } else {
          console.log(this.addLevel)
          const { data: res } = await this.$http.post('gradeTable/add', this.addLevel)
          if (res.code !== 100) return this.$message.error('添加等级失败')
          this.$message.success('添加等级成功')
          console.log(res)
        }
        this.getLevelList()
        this.addLevelDialog = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .level{
    .addLevel{
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #000;
    }
    .changebtn{
      margin-right: 10px;
    }
  }
</style>
