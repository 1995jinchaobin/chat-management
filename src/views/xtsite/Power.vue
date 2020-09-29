<template>
  <div class="power">
    <div class="addpower">
      <el-button @click="changeFenleiInfo('add')" type="success" v-if="isWrite==='isWriteQweasd'">添加权限类型</el-button>
    </div>
    <el-table
      :data="adminFenleiList"
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
        prop="adminType"
        label="类型名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <el-link @click="changeFenleiInfo(scope.row)" v-if="scope.row.id!==1" class="changeadmin">修改</el-link>
          <delete-btn @delinfobtn='delinfobtn(scope.row)' v-if="scope.row.id!==1" :name="'权限类型:'+scope.row.adminType"></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="powerTitie"
      :visible.sync='powerListDialog'
      :close-on-click-modal='false'
      @close='closeDialog'>
      <el-form
        ref="powerRef"
        :model="a"
        :rules="aRule"
        label-width="80px">
        <el-form-item
          label="类型名称"
          prop="adminType">
          <el-input v-model="a.adminType" placeholder="请输入类型名称"></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        :data="powerListAll"
        :props="defaultProps"
        check-on-click-node
        show-checkbox
        node-key='id'
        default-expand-all
        :default-checked-keys='defKeyArr'
        ref="treeRef">
      </el-tree>
      <span slot="footer">
        <el-button @click="powerListDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeFenleiBtn">确 定</el-button>
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
    var validatePhone = async (rule, value, callback) => {
      if (this.beforAdminType === this.a.adminType && this.beforAdminType !== '') return callback()
      if (value === '') return callback(new Error('请输入权限类型名称'))
      await this.getAdminType()
      if (this.code !== 100) {
        callback(new Error('权限类型名称已存在'))
      } else {
        callback()
      }
    }
    return {
      adminFenleiList: [],
      powerListAll: [],
      defaultProps: {
        label: 'module',
        children: 'moduleDicList'
      },
      defKeyArr: [],
      powerListDialog: false,
      powerTitie: '',
      fenleiValue: [],
      // 添加权限空数组
      addPowerList: [],
      a: {
        id: null,
        adminType: '',
        mam: []
      },
      beforAdminType: '',
      aRule: {
        adminType: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      },
      code: null
      // isWrite: ''
    }
  },
  async created () {
    this.isWrite = window.sessionStorage.getItem('isWrite')
    await this.getAdminFenleiList()
    this.getPowerList()
    this.getAddPowerList()

    // this.isWrite = window.sessionStorage.getItem('isWrite')
    console.log(this.isWrite)
    // this.showFenpeiRoles()
  },
  methods: {
    async getAdminFenleiList () {
      const { data: res } = await this.$http.get('mam/select')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取管理员权限分类列表失败')
      this.adminFenleiList = res.data.adminTypeList
    },
    // 添加权限空数组列表
    getAddPowerList () {
      console.log(this.adminFenleiList)
      this.adminFenleiList.forEach(item => {
        if (item.id === 1) {
          this.addPowerList = item.mam
        }
      })
      for (const a of this.addPowerList) {
        console.log(a)
        this.beforAdminType = ''
        delete a.id
        delete a.adminTypeId
      }
      console.log(this.addPowerList)
    },
    async getPowerList () {
      const { data: res } = await this.$http.get('moduleDic/selectModuleList')
      console.log(res)
      this.powerListAll = res.data.queryModuleListData
    },
    // 删除
    async delinfobtn (value) {
      const { data: res } = await this.$http.delete(`mam/delete?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除权限分类失败')
      this.$message.success('删除权限分类成功')
      this.getAdminFenleiList()
    },
    // 添加修改分类权限
    changeFenleiInfo (value) {
      if (value === 'add') {
        this.beforAdminType = ''
        this.powerTitie = '添加权限类型'
        this.a.adminType = ''
        // console.log(this.addPowerList)
        this.fenleiValue = JSON.parse(JSON.stringify(this.addPowerList))
        // console.log(this.fenleiValue)
      } else {
        this.powerTitie = '修改权限类型'
        this.fenleiValue = JSON.parse(JSON.stringify(value.mam))
        console.log(this.fenleiValue)
        this.a.id = value.id
        this.beforAdminType = value.adminType
        this.a.adminType = value.adminType
        this.getPowerId(value.mam)
      }
      // 更新树状图默认选择框
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(this.defKeyArr)
      })
      console.log(value)
      this.powerListDialog = true
    },
    // 获取权限默认选中的id
    getPowerId (value) {
      console.log(value)
      value.forEach(item => {
        if (item.status === 1) {
          this.defKeyArr.push(item.moduleId)
        }
      })
      console.log(this.defKeyArr)
    },
    // 消息框关闭
    closeDialog () {
      this.defKeyArr = []
      this.$refs.powerRef.clearValidate()
    },
    // 消息框的确定按钮
    async changeFenleiBtn () {
      this.$refs.powerRef.validate(async value => {
        if (!value) return
        if (this.a.adminType.trim().length === 0) return this.$message.error('请输入类型名称')
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        console.log(keys)
        this.fenleiValue.forEach(item => {
          console.log(keys.indexOf(item.moduleId))
          if (keys.indexOf(item.moduleId) !== -1) {
            item.status = 1
          } else {
            item.status = 0
          }
        })
        console.log(this.fenleiValue)
        this.a.mam = this.fenleiValue
        console.log(this.a)
        if (this.powerTitie === '修改权限类型') {
          const { data: res } = await this.$http.post('mam/update', this.a)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改权限失败')
          this.$message.success('修改权限成功')
        } else {
          delete this.a.id
          this.a.mam.forEach(item => {
            if (item.id) {
              delete item.id
            }
          })
          console.log(this.a)
          const { data: res } = await this.$http.post('mam/insert', this.a)
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加权限类型失败')
          this.$message.success('添加权限类型成功')
        }
        console.log(this.a)
        this.getAdminFenleiList()
        this.powerListDialog = false
      })
    },
    // 权限类型名查重
    async getAdminType () {
      const { data: res } = await this.$http.get(`mam/check?adminType=${this.a.adminType}`)
      console.log(res)
      this.code = res.code
    }
  }
}
</script>

<style lang='less' scoped>
.power{
  .addpower{
    margin-bottom: 10px;
    padding-bottom:10px;
    border-bottom:1px solid #000
  }
  .changeadmin{
    margin-right: 10px;
  }
}
</style>
