<template>
  <div class="addlevel">
    <el-form
      ref="addLevelRef"
      :model="addLevel"
      :rules="addLevelRule"
      label-width="150px">
      <!-- <el-form-item
        label="用户ID"
        prop="userId">
        <el-input
          v-model="addLevel.userId"
          placeholder="请输入用户ID"
          :disabled="levelTitle==='修改等级'"
          >
        </el-input>
      </el-form-item> -->
      <el-form-item
        label="会员组名称"
        prop="name">
        <el-input v-model="addLevel.name" placeholder="请输入会员组名称"></el-input>
      </el-form-item>
      <el-form-item
        label="直推人数">
        <el-input v-model="addLevel.directPush" placeholder="请输入直推人数"></el-input>
      </el-form-item>
      <el-form-item
        label="团队人数">
        <el-input v-model="addLevel.team" placeholder="请输入团队人数"></el-input>
      </el-form-item>
      <el-form-item
        label="建群人数">
        <el-input v-model="addLevel.groupBuilding" placeholder="请输入建群人数"></el-input>
      </el-form-item>
      <el-form-item
        label="建群费用">
        <el-input v-model="addLevel.cost" placeholder="请输入建群费用"></el-input>
      </el-form-item>
      <el-form-item
        label="可建群数量">
        <el-input v-model="addLevel.number" placeholder="请输入可建群数量"></el-input>
      </el-form-item>
      <el-form-item
        label="多久未登陆自动封号">
        <el-input v-model="addLevel.titleTime" placeholder="请输入多久未登陆自动封号时间"></el-input>
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
  props: ['addLevel', 'levelTitle'],
  data () {
    return {
      addLevelRule: {
        // userId: [
        //   { required: true, message: '请输入用户ID', trigger: 'blur' }
        // ],
        name: [
          { required: true, message: '请输入会员组名称', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style>

</style>
