<template>
  <div id="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogvisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 主内容 -->
      <el-table :data="rolelist" style="width: 100%" :border="true">
        <!-- 展开列 -->
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbuttom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循坏 嵌套渲染二级权限 -->
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                      <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogvisible" width="50%" @close="addDislogClosed">
      <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="rolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialogvisible = false">取 消</el-button>
        <el-button type="info" @click="addDislogClosed">重 置</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editRolesForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下面的按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="info" @click="editDialogClosed">重 置</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
      <!-- 内容主体区域 -->
      <!-- 树形控件 -->
      <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <!-- 下面的按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api.js'

export default {
  name: 'roles',
  data() {
    return {
      // 角色列表数据
      rolelist: [],
      // 控制角色添加对话框显示
      addDialogvisible: false,
      // 添加角色绑定数据
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加数据验证
      addRolesFormRules: {
        roleName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        roleDesc: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      // 编辑对话框显示控制
      editDialogVisible: false,
      // 编辑对象信息
      editRolesForm: {},
      // 修改数据验证
      editFormRules: {
        roleName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        roleDesc: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      // 控制分配权限按钮对话框
      setRightDialogVisible: false,
      // 所有权限数据
      rightlist: [],
      // 树形控件绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id数值组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await api.get('roles')
      if(res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    addDislogClosed() {
      this.$refs.rolesFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addRolesUser() {
      this.$refs.rolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await api.post('roles', this.addRolesForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addDialogvisible = false
      })
    },
    editRoleInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const {data: res} = await api.put('roles/' + this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败!')
        }
          this.$message.success('修改角色成功!')
          this.getRolesList()
        this.editDialogVisible = false
      })
    },
    async showEditDialog(id) {
      const { data: res } = await api.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败!')
      }
      this.editRolesForm = res.data
      // console.log(this.editRolesForm)
      this.editDialogVisible = true
    },
    async removeRoleById(id) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      // console.log(confirmResult)
      // 如果用户点击确认返回confirm
      // 若果用户点击取消则返回值为错误  用catch接收错误，然后config出来 cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
        return
      }
      const { data: res } = await api.delete('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 刷新数据
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      // console.log(confirmResult)
      // 如果用户点击确认返回confirm
      // 若果用户点击取消则返回值为错误  用catch接收错误，然后config出来 cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
        return
      }
      const { data: res } = await api.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // 刷新数据
      // 更新数据后不返回的话不能重新请求数据
      // this.getRolesList()
      role.children = res.data
    },
    async showSetDialog(role) {
      this.roleId = role.id
      // 获取权限数据
      const {data: res} = await api.get('rights/tree')
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 吧获取的数据保存到data中  然后附给rightlist
      this.rightlist = res.data
      this.getRolesList()
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取三级数据 
    // 通过递归的形式获取所有三级数据的id，并且保存到defKeys中去
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性  则是三级节点
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClose() {
      // 监听分配权限对话框的关闭事件
      this.defKeys = []
    },
    async allotRights() {
      // 点击为角色分配权限
      // 将选中的id组成一组数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const {data: res} = await api.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  },
}
</script>
<style lang="scss" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbuttom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>