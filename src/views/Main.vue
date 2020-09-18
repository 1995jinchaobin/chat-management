<template>
<div class="main">
  <el-container
  style="height:100vh">
    <el-aside
    :width="collapse?'64px':'220px'">
      <el-menu
      background-color="#2F4050"
      text-color="#A7B1C2"
      active-text-color="#fff"
      hover-text-color="#fff"
      unique-opened
      :collapse="collapse"
      :collapse-transition='false'
      :router='true'>
        <!-- 用户头像 -->
        <div
        class="imgUser"
        v-show="!collapse">
          <img
          src="@/assets/profile_small.jpg"
          alt="#">
        </div>
        <!-- app设置 -->
        <el-submenu index="1" v-if="powerListArr.indexOf('15')!==-1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">app设置</span>
          </template>
          <el-menu-item index="android" @click="tagBtn('android')">安卓下载地址</el-menu-item>
          <el-menu-item index="apple" @click="tagBtn('apple')">苹果下载地址</el-menu-item>
        </el-submenu>
        <!-- 广播管理 -->
        <el-submenu index="2" v-if="powerListArr.indexOf('23')!==-1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">广播管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="contentlist" @click="tagBtn('contentlist')">广播列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 会员管理 -->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">会员管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="user" @click="tagBtn('user')" v-if="powerListArr.indexOf('26')!==-1">用户管理</el-menu-item>
            <el-menu-item index="userchat" @click="tagBtn('userchat')" v-if="powerListArr.indexOf('34')!==-1">聊天管理</el-menu-item>
            <el-menu-item index="level" @click="tagBtn('level')" v-if="powerListArr.indexOf('29')!==-1">会员等级</el-menu-item>
            <el-menu-item index="blacklist" @click="tagBtn('blacklist')">拉黑管理</el-menu-item>
            <!-- <el-menu-item index="chatroom" @click="tagBtn('chatroom')">聊天室管理</el-menu-item> -->
            <!-- <el-menu-item index="site" @click="tagBtn('site')">其他设置</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>
        <!-- 聊天室管理 -->
        <el-submenu index="9">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">聊天室管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="chatroom" @click="tagBtn('chatroom')">聊天室内容</el-menu-item>
             <el-menu-item index="chatmember" @click="tagBtn('chatmember')">聊天室人员</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 其他设置 -->
        <el-submenu index="8" v-if="powerListArr.indexOf('38')!==-1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">其他设置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="site" @click="tagBtn('site')">标签设置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 图片管理 -->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">图片管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="switch" @click="tagBtn('switch')" v-if="powerListArr.indexOf('42')!==-1">轮播图</el-menu-item>
            <el-menu-item index="sysinform" @click="tagBtn('sysinform')" v-if="powerListArr.indexOf('40')!==-1">系统通知</el-menu-item>
            <el-menu-item index="userimg" @click="tagBtn('userimg')">聊天图片</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 系统设置 -->
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">系统设置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="admin" @click="tagBtn('admin')">管理员</el-menu-item>
            <el-menu-item index="power" @click="tagBtn('power')">权限设置</el-menu-item>
            <el-menu-item index="senword" @click="tagBtn('senword')">敏感词管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 菜单管理 -->
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">菜单管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="groupm" @click="tagBtn('groupm')">群管理</el-menu-item>
            <el-menu-item index="groupchat" @click="tagBtn('groupchat')">群聊天</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 投诉列表 -->
        <el-submenu index="7">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">投诉列表</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="complaintlist" @click="tagBtn('complaintlist')">投诉列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 右侧视图 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="top">
          <el-button
          type="success"
          :icon="collapse?'el-icon-s-unfold':'el-icon-s-fold'"
          class="iconCe"
          @click="collapse=!collapse"></el-button>
          <span>清空缓存</span>
        </div>
        <div
        class="tabTop">
          <!-- <i class="el-icon-caret-left"></i> -->
          <el-button icon="el-icon-caret-left" class="iconLeft" @click="tagLeftBtn"></el-button>
          <el-button icon="el-icon-caret-right" class="iconRight" @click="tagRightBtn"></el-button>
          <!-- <i class="el-icon-caret-right"></i> -->
          <el-button icon="el-icon-switch-button" class="outBtn" @click="pushLogin">退出</el-button>
          <el-button class="closeTagBtn" @click="closeOtherTag">关闭其他选项卡</el-button>
          <div :class="zuoyi?'tagLeft':''" class="tagAll">
            <el-tag
              v-for="(tag,index) in tags"
              :key="tag.name"
              :closable="tags.length===1?false:true"
              :class="tagIndex===index?'tag':''"
              @close="handleClose(tag)"
              @click="tagNavBtn(tag.url)"
              >
              {{tag.name}}
            </el-tag>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="neibu">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      collapse: false,
      tags: [
        { name: '首页', url: 'home' }
      ],
      tagAllList: [
        { name: '安卓下载地址', url: 'android' },
        { name: '苹果下载地址', url: 'apple' },
        { name: '广播列表', url: 'contentlist' },
        { name: '用户管理', url: 'user' },
        { name: '会员等级', url: 'level' },
        { name: '拉黑管理', url: 'blacklist' },
        { name: '聊天管理', url: 'userchat' },
        { name: '聊天室内容', url: 'chatroom' },
        { name: '聊天室人员', url: 'chatmember' },
        { name: '标签设置', url: 'site' },
        { name: '轮播图', url: 'switch' },
        { name: '系统通知', url: 'sysinform' },
        { name: '聊天图片', url: 'userimg' },
        { name: '管理员', url: 'admin' },
        { name: '权限设置', url: 'power' },
        { name: '敏感词管理', url: 'senword' },
        { name: '群管理', url: 'groupm' },
        { name: '群聊天', url: 'groupchat' },
        { name: '投诉列表', url: 'complaintlist' }
      ],
      // 点击标签的位置
      tagIndex: 0,
      zuoyi: false,
      powerListArr: []
    }
  },
  created () {
    this.$router.push('home')
    this.powerListArr = Base64.decode(window.sessionStorage.getItem('power')).split(',')
    console.log(this.powerListArr)
  },
  methods: {
    // 左侧菜单栏点击
    tagBtn (url) {
      console.log(url)
      const a = this.tags.map(item => {
        return item.url
      }).indexOf(url)
      console.log(a)
      if (a === -1) {
        const push = this.tagAllList.find(item => {
          return item.url === url
        })
        console.log(push)
        this.tags.push(push)
        this.tagIndex = this.tags.length - 1
        console.log(this.tags)
      } else {
        this.tagIndex = a
      }
    },
    // 点击标签
    tagNavBtn (url) {
      console.log(url)
      const a = this.tags.map(item => {
        return item.url
      }).indexOf(url)
      console.log(a)
      this.tagIndex = a
      this.$router.push(url)
    },
    // 关闭标签
    handleClose (value) {
      console.log(value)
      console.log(this.tags.indexOf(value))
      console.log(this.tagIndex) // 2
      console.log(this.tags.length)// 3
      console.log(this.tagIndex === this.tags.length - 1)
      const gl = this.tagIndex
      const dj = this.tags.indexOf(value)
      const al = this.tags.length
      // const rt = this.tags[gl].url
      if (gl === dj && dj === al - 1) {
        this.tagIndex -= 1
        const rt1 = this.tags[gl - 1].url
        this.$router.push(rt1)
      } else if (gl === dj && gl !== al - 1) {
        const rt2 = this.tags[gl + 1].url
        this.$router.push(rt2)
        console.log(rt2)
      } else if (gl > dj) {
        this.tagIndex -= 1
        const rt1 = this.tags[gl].url
        this.$router.push(rt1)
      } else {
        const rt1 = this.tags[gl].url
        this.$router.push(rt1)
      }
      this.tags.splice(this.tags.indexOf(value), 1)
    },
    // 左移按钮标签
    tagLeftBtn () {
      this.zuoyi = false
    },
    // 右移按钮标签
    tagRightBtn () {
      console.log('you ')
      this.zuoyi = true
    },
    // 关闭其他标签卡
    closeOtherTag () {
      const obj = this.tags[this.tagIndex]
      this.tags = []
      this.tags.push(obj)
    },
    // 退出
    pushLogin () {
      window.sessionStorage.clear()
      this.$router.push('login')
    }
  }
}
</script>
<style lang='less'>
.main{
  .el-container{
    min-width: 800px;
  }
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 14px;
  .el-aside{
    background-color: #2F4050;
    // 鼠标悬浮
    .el-submenu__title:hover,.el-menu-item:hover{
      color: #fff !important;
    }
  }
  // 隐藏侧边菜单滚动条
  .el-aside::-webkit-scrollbar {
    display: none;
  }
  // 侧边栏头像
  .imgUser{
    height:150px;
    img{
      border-radius: 50%;
      margin: 30px;
    }
  }
  .el-menu{
    border:none
  }
  .el-menu-item{
    height: 38px !important;
    line-height: 38px !important;
    border-left: 5px solid #19AA8D;
    }
  .el-submenu__title{
    height: 45px !important;
    line-height: 45px !important;
  }
  // 右边头部
  .el-header{
    height: 85px !important;
    padding: 0;
    border-bottom: 3px solid #000;
    .top{
      height: 50px;
      background-color:#F3F3F4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .iconCe{
        font-size: 25px;
        width: 35px;
        height: 30px;
        text-align: center;
        padding: 0;
      }
      span{
        font-size:14px;
        font-weight: 600;
        color: #999c9e;
      }
    }
    .tabTop{
      height: 32px;
      background-color: #fff;
      display: flex;
      position: relative;
      // overflow: hidden;
      // border-bottom: 2px solid #ccc;
      // i{
      //   font-size: 30px;
      // }
      .iconLeft,.iconRight{
        position: absolute;
        height: 32px;
        width: 30px;
        font-size: 25px;
        padding:0;
        color: #ccc;
      }
      .iconRight{
        right: 159px;
      }
      .outBtn{
        position: absolute;
        right: 0;
        height: 32px;
        width: 60px;
        padding: 0;
      }
      .tag{
        background-color: blue;
        color:#fff;
        border-bottom: 1px solid blue;
      }
      .tagAll{
        margin: 0 189px 0 30px;
        display: flex;
        width: 100%;
        overflow: hidden;
      }
      .closeTagBtn{
        position: absolute;
        right: 59px;
        height: 32px;
        padding: 0;
      }
      .tagLeft{
        justify-content: flex-end;
      }
      .el-tag{
        cursor: pointer;
      }
    }
  }
  .el-main{
    padding: 0px;
    background-color: #F3F3F4;
    .neibu{
      padding: 20px;
    }
  }
  .el-main>div{
    width: calc(100% - 40px);
    min-height: calc(100% - 40px);
    background: #fff;
    margin: 20px;
    box-shadow: 0 -3px #E7EAEC;
  }
}
</style>
