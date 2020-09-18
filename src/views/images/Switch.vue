<template>
  <div class="switch">
    <div class="addImg">
      <el-button @click="addImgDialogOpen">添加图片</el-button>
    </div>
    <el-table
      :data="switchList"
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
        label="图片">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.imageUrl" class="imgSmall" @click="lookImg(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="imageTime"
        label="上传时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="switchListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="switchListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加图片 -->
    <el-dialog
      title="添加图片"
      :visible.sync="addImgDialog"
      width="60%"
      :close-on-click-modal='false'>
      <el-form
        :model="addImgParams"
        label-width="150px">
        <!-- 图片上传 -->
        <el-form-item label="上传图片">
          <img-upload @imgPath='imgPath' @delImgPath='delImgPath'></img-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addImgDialog = false">取 消</el-button>
        <el-button type="primary" @click="addImgDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imageDialog"
      width="40%">
      <img :src="$imgUrl+imageUrl" class="imgSmall"/>
    </el-dialog>
  </div>
</template>

<script>
import deleteBtn from '@/components/deleteBtn.vue'
import imgUpload from '@/components/imgUpload.vue'
export default {
  components: {
    deleteBtn,
    imgUpload
  },
  data () {
    return {
      switchListParams: {
        selectCount: 10,
        currenPage: 1
      },
      switchList: [],
      allTotal: 0,
      // 添加图片
      addImgDialog: false,
      addImgParams: {
        imgPath: '',
        imageType: 0
      },
      // },
      imageUrl: '',
      imageDialog: false
    }
  },
  created () {
    this.getSwitchList()
  },
  methods: {
    async getSwitchList () {
      const { data: res } = await this.$http.get('imageComment/selectLb', { params: this.switchListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取轮播图数据列表失败')
      this.switchList = res.data.memberPageData.pageData
      if (this.switchList.length === 0 && this.switchListParams.currenPage > 1) {
        this.switchListParams.currenPage -= 1
        this.getSwitchList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.switchListParams.selectCount = val
      this.getSwitchList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.switchListParams.currenPage = val
      this.getSwitchList()
    },
    // 打开添加图片消息框
    addImgDialogOpen () {
      this.addImgParams.imgPath = ''
      this.addImgDialog = true
    },
    // 添加图片确定
    async addImgDialogBtn () {
      // this.addImgParams.imageType = parseInt(this.addImgParams.imageType)
      console.log(this.addImgParams)
      if (this.addImgParams.imgPath === '') return this.$message.error('请选择上传图片')
      const { data: res } = await this.$http.post('imageComment/insImage', this.addImgParams)
      console.log(res)
      if (res.code !== 100) return this.$messgae.error('添加轮播图失败')
      this.$message.success('添加轮播图成功')
      this.getSwitchList()
      this.addImgDialog = false
    },
    // 图片上传组件
    imgPath (path) {
      console.log(path)
      this.addImgParams.imgPath = path.data.imgPath
    },
    delImgPath () {
      this.addImgParams.imgPath = ''
    },
    async delinfobtn (value) {
      console.log(value.id)
      const { data: res } = await this.$http.delete(`imageComment/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除轮播图失败')
      this.$message.success('删除轮播图成功')
      this.getSwitchList()
    },
    // 图片预览
    lookImg (value) {
      this.imageUrl = value.imageUrl
      console.log(this.imageUrl)
      this.imageDialog = true
    }
  }
}
</script>

<style lang='less' scoped>
.imgSmall{
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
