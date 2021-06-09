<template>
  <div id="welcome">
    <el-card class="w-img">
      <div class="w-info">欢迎登录管理系统</div>
    </el-card>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  .w-img {
    background-image: url(../../assets/img/code.jpg);
    background-size: cover;
    background-size:100% 100%;
    background-repeat: no-repeat;
    height: 735px;
    position: relative;
    border-radius: 20px;
    .w-info {
      position: absolute;
      left: 50%;
      top: 20%;
      transform: translate(-50%,0);
      font-size: 50px;
    }
  }
</style>