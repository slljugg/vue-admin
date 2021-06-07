<template>
  <div id="rights">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import api from '../../api.js'

export default {
  name: 'rights',
  data() {
    return {
      // 权限列表参数
      rightsList: []
    }
  },
  created() {
    // 创建的时候加载权限列表参数
    this.getRightsList()
  },
  methods: {
    // 权限列表数据获取函数
    async getRightsList() {
      const {data: res} = await api.get('rights/list')
      if(res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
        return
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
