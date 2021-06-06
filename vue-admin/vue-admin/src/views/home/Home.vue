<template>
  <div id="home">
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../../assets/img/code.jpg" alt="">
          <span>后台管理系统</span>
        </div>
        <el-button type="info" 
        @click="logout">退出</el-button>
      </el-header>
      <!-- 主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '61px' : '200px'">
          <div class="toggle-button">
            <div @click="toggleCollapse">
              <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949"
              >
              </el-switch>
            </div>
          </div>
          <el-menu text-color="#409EFF" active-text-color="#F56C6C" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单的模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="isactivePath('/' + subItem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <!-- 子组件 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import api from '../../api.js'
export default {
  name: 'home',
  data() {
    return {
      // 默认打开还是关闭
      value: true,
      // 是否折叠
      isCollapse: false,
      // 激活标志
      activePath: '',
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        // 一级菜单的icon图标
        147: 'el-icon-magic-stick',
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取原始表单数据
    async getMenuList() {
      const {data: res} = await api.get('menus')
      // console.log(res)
      if(res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    isactivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // console.log(this.activePath)
      this.activePath = activePath
      // console.log(this.activePath)
    }
  },
}
</script>

<style lang="scss" scoped>
  #home {
    height: 100%;
  }
  .home_container {
    height: 100%;
    .el-header {
      display: flex;
      background-color: #373d41;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 20px;
      padding: 0 40px 0 20px;
      > div {
        display: flex;
        align-items: center;
        span {
          margin-left: 30px;
        }
      }
      img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
      }
      .el-button {
        width: 100px;
      }
    }
    .el-aside {
      background-color: #333444;
    }
    .el-main {
      background-color: rgb(246, 246, 246);
    }
    .el-menu {
      border: 0px;
    }
    .iconfont {
      margin-right: 10px;
    }
    .toggle-button {
      background-color: #4a5064;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 35px;
    }
  }
</style>