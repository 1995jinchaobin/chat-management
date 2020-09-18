<template>
  <el-link @click="delbtn">删除</el-link>
</template>

<script>
export default {
  methods: {
    // 删除按钮提示
    async delbtn () {
      const confirmRes = await this.$confirm('此操作将永久删除该信息,是否继续', '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$emit('delinfobtn')
    }
  }
}
</script>

<style>

</style>
