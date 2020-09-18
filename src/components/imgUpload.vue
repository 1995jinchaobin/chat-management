<template>
  <div class="imgupload">
    <!-- action 图片上传的数据库地址 on-remove 图片移除  list-type 图片显示效果  headers 设置上传的请求头部   on-success 文件上传成功的钩子函数-->
    <el-upload
      :selectCount=1
      :action="$imgUrl+'imageComment/upload'"
      :before-upload="beforeAlbumUpload"
      :file-list="[]"
      :on-remove="handleRemove"
      list-type="picture"
      :headers='headerAuthorization' :on-success='headerSuccess'>
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  data () {
    return {
      headerAuthorization: {
        // 给图片的上传路径添加保存在sessionStorage的token
        // Authorization: window.sessionStorage.getItem('userToken')
      }
    }
  },
  methods: {
    // 图片上传成功
    headerSuccess (res) {
      console.log(res)
      this.$emit('imgPath', res)
    },
    // 文件上传限制
    beforeAlbumUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 图片移出
    handleRemove (file) {
      this.$emit('delImgPath')
    }
  }
}
</script>

<style>

</style>
