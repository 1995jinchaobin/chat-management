<template>
  <div class="home">
    <div class="addMember">
      <h5>新增会员</h5>
        <ul>
          <li><div></div>全部会员<span>{{userData.userAll}}</span>人</li>
          <li><div></div>今日新增<span>{{userData.userDay}}</span>人</li>
          <li><div></div>本周新增<span>{{userData.userWeek}}</span>人</li>
          <li><div></div>本月新增<span>{{userData.userMonth}}</span>人</li>
        </ul>
    </div>
    <div class="addMember">
      <h5>新增投诉</h5>
        <ul>
          <li><div></div>全部投诉<span>{{complaint.complaintAll}}</span>条</li>
          <li><div></div>今日投诉<span>{{complaint.complaintDay}}</span>条</li>
          <li><div></div>本周投诉<span>{{complaint.complaintWeek}}</span>条</li>
          <li><div></div>本月投诉<span>{{complaint.complaintMonth}}</span>条</li>
          <li><div></div>未处理投诉<span>{{complaint.complaintUntreated}}</span>条</li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      complaint: {},
      userData: {}
    }
  },
  created () {
    this.getHomeInfo()
  },
  methods: {
    async getHomeInfo () {
      const { data: res } = await this.$http.get('index/count')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取首页数据失败')
      this.complaint = res.data.complaint
      this.userData = res.data.userData
    }
  }
}
</script>

<style lang='less' scoped>
  .home{
    display: flex;
    flex-wrap: wrap;
    .addMember{
      background-color: #eee;
      padding: 15px;
      width: 350px;
      margin: 20px;
      height: 300px;
      border-radius: 10px;
      h5{
        font-size: 100%;
        margin-bottom: 30px;
      }
      li{
        list-style:none;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-top: 15px;
        height: 30px;
        line-height: 30px;
        div{
          background-color: #1AB394;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          margin-right: 50px;
          margin-left: 10px;
        }
        span{
          width: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
