<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import "./assets/icon.css";
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,#app{
  height: 100vh;
}
.el-pagination{
  margin-top: 10px;
}
.red{
  color: red;
}
.marginRight{
  margin-right: 10px;
}
.marginLeft{
  margin-left: 10px;
}
</style>
