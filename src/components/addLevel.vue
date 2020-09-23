<template>
  <div class="addlevel">
    <el-form
      ref="addLevelRef"
      :model="addLevel"
      :rules="addLevelRule"
      label-width="190px">
      <el-form-item
        label="会员等级名称"
        prop="name">
        <el-input v-model="addLevel.name" placeholder="请输入会员等级名称"></el-input>
      </el-form-item>
      <el-form-item
        label="直推人数"
        prop="directPush">
        <el-input v-model="addLevel.directPush" placeholder="请输入直推人数"></el-input>
      </el-form-item>
      <el-form-item
        label="团队人数"
        prop="team">
        <el-input v-model="addLevel.team" placeholder="请输入团队人数"></el-input>
      </el-form-item>
      <el-form-item
        label="可建群数量"
        prop="number">
        <el-input v-model="addLevel.number" placeholder="请输入可建群数量"></el-input>
      </el-form-item>
      <el-form-item
        label="建群人数"
        prop="groupBuilding">
        <el-input v-model="addLevel.groupBuilding" placeholder="请输入建群人数"></el-input>
      </el-form-item>
      <el-form-item
        label="建群费用"
        prop="cost">
        <el-input v-model="addLevel.cost" placeholder="请输入建群费用"></el-input>
      </el-form-item>
      <el-form-item
        label="多久未登陆自动封号(天)"
        prop="titleTime">
        <el-input v-model="addLevel.titleTime" placeholder="请输入多久未登陆自动封号时间(天)"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="会员组名称">
        <el-input v-model="addLevel.name" placeholder="请输入会员组名称"></el-input>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['addLevel', 'levelTitle', 'name'],
  data () {
    const validateLevel = async (rule, value, callback) => {
      if (this.addLevel.name === this.name && this.name !== '') return callback()
      if (value === '') return callback(new Error('请输入会员等级名称'))
      await this.getLevelCheck()
      if (this.code !== 100) {
        callback(new Error('会员等级名称已存在'))
      } else {
        callback()
      }
    }
    const validate = async (rule, value, callback) => {
      // console.log(value)
      // console.log(value.toString().trim() === '')
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else if (value.toString().trim() === '') {
        callback(new Error('请输入数字'))
      } else {
        // console.log(value.trim() === '')
        callback()
      }
    }
    return {
      addLevelRule: {
        name: [
          { required: true, validator: validateLevel, trigger: 'blur' }
        ],
        directPush: [
          { required: true, message: '请输入直推人数', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        team: [
          { required: true, message: '请输入团队人数', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        groupBuilding: [
          { required: true, message: '请输入建群人数', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入可建群数量', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入建群费用', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        titleTime: [
          { required: true, message: '请输入多久未登录自动封号(天)', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      },
      code: null
    }
  },
  created () {
    console.log(123)
    console.log(this.addLevel)
  },
  methods: {
    async getLevelCheck () {
      console.log(this.addLevel.name)
      console.log(this.name)
      const { data: res } = await this.$http.get(`gradeTable/check?name=${this.addLevel.name}`)
      console.log(res)
      this.code = res.code
    }
  }
}
</script>

<style>

</style>
