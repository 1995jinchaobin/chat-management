.<template>
  <div class="userimg">
    <div class="search">
      <el-input
        class="imgid"
        v-model="userImgListParams.id"
        placeholder="请输入图片编号"
        clearable
        @change="getUserImgList">
      </el-input>
      <el-input
        class="userid"
        v-model="userImgListParams.userId"
        placeholder="请输入用户ID"
        clearable
        @change="getUserImgList">
      </el-input>
       <el-select
        class="imgtype"
        v-model="userImgListParams.imageType"
        placeholder="请选择图片类型"
        clearable
        @change="getUserImgList">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getUserImgList" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="userImgList"
      stripe
      border
      >
      <el-table-column
        align="center"
        prop="id"
        label="图片编号">
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
        prop="userId"
        label="用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.imageType===1">用户头像</span>
          <span v-else-if="scope.row.imageType===2">用户聊天</span>
          <span v-else>群聊天</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="imageTime"
        label="时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        v-if="isWrite==='isWriteQweasd'">
        <template slot-scope="scope">
          <delete-btn @delinfobtn='delinfobtn(scope.row)'></delete-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userImgListParams.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="userImgListParams.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
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
// import imgUpload from '@/components/imgUpload.vue'
export default {
  components: {
    deleteBtn
    // imgUpload
  },
  data () {
    return {
      userImgListParams: {
        id: null,
        imageType: null,
        userId: null,
        currenPage: 1,
        selectCount: 10
      },
      userImgList: [],
      allTotal: 0,
      options: [
        { value: 1, label: '用户头像' },
        { value: 2, label: '用户聊天' },
        { value: 3, label: '群聊天' }
      ],
      // 图片预览
      imageUrl: '',
      imageDialog: false
    }
  },
  created () {
    this.getUserImgList()
    this.isWrite = window.sessionStorage.getItem('isWrite')
  },
  methods: {
    async getUserImgList () {
      console.log(this.userImgListParams)
      if (parseInt(this.userImgListParams.id)) {
        this.userImgListParams.id = parseInt(this.userImgListParams.id)
      } else {
        this.userImgListParams.id = null
      }
      if (parseInt(this.userImgListParams.userId)) {
        this.userImgListParams.userId = parseInt(this.userImgListParams.userId)
      } else {
        this.userImgListParams.userId = null
      }
      console.log(this.userImgListParams)
      const { data: res } = await this.$http.get('imageComment/selectAll', { params: this.userImgListParams })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取图片数据失败')
      this.userImgList = res.data.memberPageData.pageData
      if (this.userImgList.length === 0 && this.userImgListParams.currenPage > 1) {
        this.userImgListParams.currenPage -= 1
        this.getUserImgList()
      }
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 删除按钮
    async delinfobtn (value) {
      const { data: res } = await this.$http.delete(`imageComment/del?id=${value.id}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除图片失败')
      this.$message.success('删除图片成功')
      this.getUserImgList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userImgListParams.selectCount = val
      this.getUserImgList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userImgListParams.currenPage = val
      this.getUserImgList()
    },
    // 图片预览
    lookImg (value) {
      this.imageUrl = value.imageUrl
      console.log(this.imageUrl)
      this.imageDialog = true
    }
    // // 打开上传消息框
    // addImgDialogOpen () {
    //   this.addImgDialog = true
    //   this.addImgParams.imgPath = ''
    // },
    // // 图片上传组件
    // imgPath (path) {
    //   console.log(path)
    //   this.addImgParams.imgPath = path.data.imgPath
    // },
    // delImgPath () {
    //   this.addImgParams.imgPath = ''
    // },
    // // 添加图片确定
    // async addImgDialogBtn () {
    //   // this.addImgParams.imageType = parseInt(this.addImgParams.imageType)
    //   console.log(this.addImgParams)
    //   if (this.addImgParams.imgPath === '') return this.$message.error('请选择上传图片')
    //   const { data: res } = await this.$http.post('imageComment/insImage', this.addImgParams)
    //   console.log(res)
    //   if (res.code !== 100) return this.$messgae.error('添加图片失败')
    //   this.$message.success('添加图片成功')
    //   this.getUserImgList()
    //   this.addImgDialog = false
    // }
  }
}
</script>

<style lang='less' scoped>
.userimg{
  .search{
    display: flex;
    margin-bottom: 10px;
    .imgid{
      width: 180px;
      margin-right: 10px;
    }
    .userid{
      width: 200px;
      margin-right: 10px;
    }
    .imgtype{
      width: 150px;
      margin-right: 10px;
    }
  }
  .imgSmall{
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
