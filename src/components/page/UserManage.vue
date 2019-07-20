
<template>
  <section class="subuser">
    <el-button @click="addUser">添加账号</el-button>
    <el-select v-model="value" placeholder="用户状态" size="mini" style="margin-left: 20px;">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-table :data="tableData" style="width: 100%;margin-top: 10px;">
      <el-table-column prop="department" label="机构" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="name" label="用户名" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="dateLine" label="到期时间" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column
        fixed="right"
        label="设置"
        width="500"
        align="center"
        label-class-name="theme-color"
      >
        <template slot-scope="scope">
          <el-button @click="lookDetail" type="text" size="small">详情</el-button>
          <el-button
            @click="lockUser"
            type="text"
            size="small"
            v-if="scope.row.status === 'normal'"
          >冻结账号</el-button>
          <el-button
            @click="initUser"
            type="text"
            size="small"
            v-if="scope.row.status !== 'normal'"
          >恢复账号</el-button>
          <el-button @click="changeUser(scope.row)" type="text" size="small">修改账号</el-button>
          <el-button type="text" size="small" @click="deleteUser">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      current-page.sync="10"
      :page-size="100"
      layout="total, prev, pager, next"
      :total="1000"
      style="margin-top:20px;"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDialog" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="dateLineRuleForm" class="ms-content">
        <el-form-item prop="department" label="机构名称">
          <el-input v-model="ruleForm.name" placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input v-model="ruleForm.name" placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="ruleForm.phone" placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="ruleForm.password" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="dateLine" label="设置会员期限">
          <el-select v-model="value" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn" style="text-align:center;">
          <el-button type="primary" class="theme-color" @click="submitForm('passwordRuleForm')">确定</el-button>
          <el-button @click="addDialog=false">取消</el-button>
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
      value: "",
      options: [
        {
          value: "正常",
          label: "正常"
        },
        {
          value: "已到期",
          label: "已到期"
        },
        {
          value: "冻结",
          label: "冻结"
        }
      ],
       dateOptions: [
        {
          value: "one",
          label: "一天"
        },
        {
          value: "week",
          label: "一周"
        },
        {
          value: "month",
          label: "一个月"
        },
        {
          value: "threeMonth",
          label: "三个月"
        },
        {
          value: "半年",
          label: "半年"
        },
         {
          value: "一年",
          label: "一年"
        },
         {
          value: "两年",
          label: "两年"
        },
         {
          value: "三年",
          label: "三年"
        },
        {
          value: "永久",
          label: "永久"
        }
      ],
      tableData: [
        {
          phone: "22222",
          name: "王小虎",
          dateLine: "dddd",
          status: "normal",
          department: "北京蓝天幼儿园"
        },
        {
          phone: "444",
          name: "王小虎",
          dateLine: "cccc",
          status: "normal",
          department: "北京蓝天幼儿园"
        },
        {
          phone: "4555",
          name: "王小虎",
          password: "rrr",
          status: "normal",
          department: "北京蓝天幼儿园"
        },
        {
          phone: "6666",
          name: "王小虎",
          dateLine: "cccc",
          status: "normal",
          department: "北京蓝天幼儿园"
        }
      ],
      ruleForm: {
        department: "",
        name: "",
        password: "",
        phone: "",
        dateLine: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        phone: [{ required: true, trigger: "blur", message: "请输入手机号" }]
      }
    };
  },
  components: {},
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    lockUser() {
      console.log(1);
    },
    initUser() {
      console.log(1);
    },
    changeUser(row) {
      this.ruleForm = {
        name: row.name,
        password: row.password,
        phone: row.phone,
        department: row.department,
        dateLine: row.dateLine
      };
      this.addDialog = true;
    },
    deleteUser() {
      this.$confirm("确定要删除吗，该账号删除之后将无妨登录访问系统", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addUser() {
      this.ruleForm = {
        name: "",
        password: "",
        phone: "",
        department: "",
        dateLine: ""
      };
      this.addDialog = true;
    },
    lookDetail() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
