<template>
  <div id="users">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisble = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 通过插槽获得数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 通过插槽获得数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 编辑用户 -->
            <el-tooltip
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisble"
      width="50%" @close="addDialogClosed"
      >
      <!-- 内容显示区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialogVisble = false">取 消</el-button>
        <el-button type="info" @click="addDialogClosed">重 置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑dialog对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下面的按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="info" @click="editDialogClosed">重 置</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisble"
      width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleslist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisble = false" type="danger">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api.js'

export default {
  name: 'users',
  data() {
    // 验证邮箱是否符合
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/
      if(regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号是否符合
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示的数目
        pagesize: 5,
      },
      // 用户信息
      userlist: [],
      // 用户总数
      total: 0,
      // 控制增加用户dialog对话框的显示
      addDialogVisble: false,
      // 控制编辑用户对话框的显示
      editDialogVisible: false,
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证用户数据
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '用户名长度在3到10个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 15,
            message: '用户名长度在6到15个字符',
            trigger: 'blur',
          },
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur'}
        ],
      },
      // 查询到的用户数据信息  修改页面
      editForm: {},
      // 修改页面数据校验规则
      editFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur'}
        ],
      },
      // 控制分配角色对话框
      setRoleDialogVisble: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      roleslist: [],
      // 已选中的角色的id值
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求初始users数据
    async getUserList() {
      const { data: res } = await api.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      console.log(res)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize 页数改变事件
    handleSizeChange(rewSize) {
      this.queryInfo.pagesize = rewSize
      // 重新获取数据
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 重新获取数据
      this.getUserList()
    },
    // 通过swith更新状态  发送数据库改变状态
    async userStateChanged(userinfo) {
      const { data: res } = await api.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('更新用户状态失败')
        return
      }
      // console.log(userinfo.mg_state)
      this.$message.success('更新用户状态成功')
    },
    // 关闭dialog后重置数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (result) => {
        // 预校验通过后发起请求
        if(!result) {
          return
        }
        const{ data : res } = await api.post('users', this.addForm)
        if(res.meta.status !== 201) {
          this.$message.error('添加用户失败')
          return
        }
        this.$message.success('添加用户成功')
        // 隐藏dialog对话框
        this.addDialogVisble = false
        // 重新获取用户数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const {data: res} = await api.get('users/' + id)
      if(res.meta.status !== 200) {
        this.$message.error('查询数据失败')
        return
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // dialog对话框  关闭监听事件  重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改数据并且提交更新
    editUserInfo() {
      this.$refs.editFormRef.validate(async (result) => {
        if(!result) {
          return
        }
        const {data: res} = await api.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status !== 200) {
          this.$message.error('用户数据更新失败')
          return
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据
        this.getUserList()
        // 提示修改成功
        this.$message.success('用户数据修改成功')
      })
    },
    // 根据id删除数据
    async removeUserById(id) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log(confirmResult)
      // 如果用户点击确认返回confirm 
      // 若果用户点击取消则返回值为错误  用catch接收错误，然后config出来 cancel
      if(confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
        return
      }
      const {data: res} = await api.delete('users/' + id)
      if(res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 刷新数据
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 展示对话框之前获取所有角色列表
      const {data: res} = await api.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleslist = res.data
      this.setRoleDialogVisble = true
    },
    async saveRoleInfo() {
      if(!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const {data: res} = await api.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId})
      if(res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisble = false
    },
    // 分配角色对话框的关闭事件
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    },
  },
} 
</script>

<style lang="scss" scoped>
</style>