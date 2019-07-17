
<template>
  <section class="subuser">
    <el-button @click="addDialog=true">添加账号</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="用户名" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="password" label="密码" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column
        fixed="right"
        label="设置"
        width="500"
        align="center"
        label-class-name="theme-color"
      >
        <template scope>
          <el-button @click="lockUser" type="text" size="small">冻结账号</el-button>
          <el-button @click="initUser" type="text" size="small">恢复账号</el-button>
          <el-button @click="changeUser" type="text" size="small">修改账号</el-button>
          <el-button type="text" size="small" @click="deleteUser">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加账号" :visible.sync="addDialog" width="400px" center :show-close="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="passwordRuleForm"
        class="ms-content"
      >
      <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
         <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="手机号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            class="theme-color"
          >完成</el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: "subuser",
  data() {
      let checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      this.checkUser().then(rep => {
        if (!rep) {
          return callback(new Error("用户名不存在"));
        }
        return callback();
      });
    };
    return {
      addDialog: false,
      tableData: [
        {
          phone: "22222",
          name: "王小虎",
          password: "dddd",
          status: "normal"
        },
        {
          phone: "444",
          name: "王小虎",
          password: "cccc",
          status: "normal"
        },
        {
          phone: "4555",
          name: "王小虎",
          password: "rrr",
          status: "normal"
        },
        {
          phone: "6666",
          name: "王小虎",
          password: "cccc",
          status: "normal"
        }
      ],
      ruleForm: {
        username: "",
        password: "",
        phone: ""
      },
       rules: {
        username: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [
          { required: true, trigger: "blur"}
        ],
        phone: [{ required: true, trigger: "blur", message: "请输入手机号" }]
      }
    };
  },
  components: {},
  mounted() {},
  methods: {
    lockUser() {
      console.log(1);
    },
    initUser() {
      console.log(1);
    },
    changeUser() {
      console.log(1);
    },
    deleteUser() {
      console.log(1);
    }
  }
};
</script>

<style scoped>
</style>
<style>
.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
</style>
