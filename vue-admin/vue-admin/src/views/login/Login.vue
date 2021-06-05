<template>
  <div id="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/img/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 提交 重置-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../../api.js'
export default {
  name: '#login',
  data() {
    return {
      // 登录表单绑定数据 :model='loginForm'
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单的验证对象  :rules='loginFormRules'
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '用户名长度在5到10个字符',
            trigger: 'blur',
          },
        ],
        // 验证密码
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '密码长度在8到15个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置菜单 ref='loginFormRef' resetFields为重置函数
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆
    login() {
      // 登录前预检验 result为true才能发送，validate为检验函数
      this.$refs.loginFormRef.validate(async (result) => {
        if (!result) {
          return
        }
        const { data: res } = await api.post('login', this.loginForm)
        // 状态码不是200的话返回登录失败
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
          return
        }
        // 状态码200登录成功  element写法
        this.$message.success('登录成功')
        // console.log(res)
        // 保存token到sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到home路由
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#login {
  background-color: #5dbe8a;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 160px;
    width: 160px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -45%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    padding: 0 20px;
    width: 100%;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
  }
}
</style>