<template>
  <div class="login">
    <el-form
      :rules="rules"
      :model="form"
      ref="form"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoading"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/services/user.js";

export default {
  name: "LoginIndex",
  data() {
    return {
      form: {
        phone: "18201288771",
        password: "111111",
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请选择密码", trigger: "change" },
          { min: 6, max: 18, message: "请输入6-18位", trigger: "blur" },
        ],
      },
      isLoading: false,
    };
  },
  methods: {
    // 登陆功能
    async onSubmit() {
      try {
        // 设置校验
        await this.$refs.form.validate();
        this.isLoading = true;
        // 发送请求
        const { data } = await login(this.form);
        this.isLoading = false;
        if (data.state === 1) {
          this.$message.success(data.message);
          // 将用户信息储存到vuex
          this.$store.commit("setUser", data.content);
          this.$router.push(this.$route.query.redirect || '/');
        } else {
          this.$message.error(data.message);
        }
      } catch (err) {
        // 校验失败的功能
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  display: flex;
  // 设置内部元素水平垂直居中
  justify-content: center;
  align-items: center;
  .el-form {
    background-color: #fff;
    padding: 20px;
    width: 300px;
    border-radius: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
