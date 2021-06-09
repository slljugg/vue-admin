<template>
  <div id="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cap_out">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态属性" name="first">
          <el-button type="primary" size="mini">添加参数</el-button>
        </el-tab-pane>
        <!-- 静态参数面板 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import api from '../../api.js'
export default {
  name: 'params',
  data() {
    return {
      // 商品数据分类
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value:'cat_id',
        label:'cat_name',
        children: 'children'
      },
      // 级联双向绑定数据
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'first',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const{data: res} = await api.get('categories')
      if(res.meta.status !== 200) {
        this.$message.error('获取商品失败')
      }
      this.catelist = res.data
    },
    // 级联选择框选择函数
    handleChange() {
      // 证明选择的是三级菜单
      if(this.selectedCateKeys.length !==3 ) {
        this.selectedCateKeys = []
        return
      }
      console.log(this.selectedCateKeys)
    },
    // tab页签的点击事件
    handleClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .cap_out {
    margin: 15px 0;
  }
</style>  