
<template>
  <section class="subuser">
    <el-button @click="addUser">添加账号</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px;"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column prop="userName" label="用户名" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="phonenumber" label="手机号" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column label="密码" align="center" label-class-name="theme-color">******</el-table-column>
      <el-table-column label="状态" align="center" label-class-name="theme-color">
        <template slot-scope="scope">
          <span>{{ scope.row.delFlag==0 ? "正常":"停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="设置"
        width="500"
        align="center"
        label-class-name="theme-color"
      >
        <template slot-scope="scope">
          <el-button
            @click="lockUser(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.delFlag == 0"
          >冻结账号</el-button>
          <el-button
            @click="initUser(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.delFlag == 1"
          >恢复账号</el-button>
          <el-button @click="changeUser(scope.row)" type="text" size="small">修改账号</el-button>
          <el-button type="text" size="small" @click="deleteUser(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        style="position: absolute;bottom: 50px;margin-left: 20px;"
        :total="pagination.total"
      ></el-pagination>
    </div>
    <el-dialog :title="titleTxt" :visible.sync="addDialog" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="passwordRuleForm" class="ms-content">
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
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
import {
  getUserList,
  removeUser,
  addUser,
  checkLoginNameUnique,
  editUser
} from "../../api/index.js";
// 修改账号表头和按钮调的接口
export default {
  name: "subuser",
  data() {
    let checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      callback();
    };
    let checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          checkLoginNameUnique({ loginName: value })
            .then(rs => {
              console.log(rs);
              if (rs !== 0 && this.oldPhone !== value) {
                callback(new Error("手机号已存在"));
              } else {
                callback();
              }
            })
            .catch(err => {
              console.log(err, "校验手机号是否存在失败");
              callback(new Error(rs.msg));
            });
        }
      }
    };
    return {
      addDialog: false,
      tableData: [],
      ruleForm: {
        name: "",
        password: "",
        phone: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        phone: [{ required: true, trigger: "blur", validator: checkPhone }]
      },
      pagination: {
        total: 0,
        size: 10,
        currentPage: 1
      },
      loading: false,
      oldPhone: "",
      titleTxt: "添加账号"
    };
  },
  components: {},
  mounted() {
    this.getUserList();
  },
  methods: {
    inti() {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    getUserList(pageNum = 1, pageSize = 10) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getUserList({
          pageNum: pageNum,
          pageSize: pageSize
        })
          .then(rs => {
            this.pagination.total = rs.total;
            if (rs.code === 0) {
              this.tableData = rs.rows;
            } else {
              this.$message({
                type: "error",
                message: rs.msg
              });
              reject(rs.msg);
            }
            this.loading = false;
          })
          .catch(err => {
            reject(err);
            this.loading = false;
          });
      });
    },
    lockUser(row) {
      editUser({
        userId: row.userId,
        delFlag: 1
      })
        .then(rs => {
          if (rs.code === 0) {
            this.$message({
              type: "success",
              message: "冻结成功!"
            });
            this.getUserList();
          } else {
            this.$message({
              type: "error",
              message: rs.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: "冻结用户失败"
          });
        });
    },
    initUser(row) {
      editUser({
        userId: row.userId,
        delFlag: 1
      })
        .then(rs => {
          if (rs.code === 0) {
            this.$message({
              type: "success",
              message: "解冻成功!"
            });
            this.getUserList();
          } else {
            this.$message({
              type: "error",
              message: rs.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: "解冻用户失败"
          });
        });
    },
    changeUser(row) {
      this.titleTxt = "修改账号";
      this.oldPhone = row.phonenumber;
      this.ruleForm = {
        name: row.userName,
        password: row.password,
        phone: row.phonenumber,
        userId: row.userId
      };
      this.addDialog = true;
    },
    deleteUser(userId) {
      this.$confirm("确定要删除吗，该账号删除之后将无妨登录访问系统", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeUser({ ids: userId })
            .then(rs => {
              if (rs.code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getUserList();
              } else {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: "删除用户失败"
              });
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
          if (this.titleTxt === "添加账号") {
            addUser({
              userName: this.ruleForm.name,
              loginName: this.ruleForm.phone,
              password: this.ruleForm.password,
              phonenumber: this.ruleForm.phone
            })
              .then(rs => {
                if (rs.code === 0) {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.getUserList();
                  this.addDialog = false;
                } else {
                  this.$message({
                    type: "error",
                    message: rs.msg
                  });
                  this.addDialog = false;
                }
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  type: "error",
                  message: "添加用户失败"
                });
                this.addDialog = false;
              });
          } else {
            editUser({
              userName: this.ruleForm.name,
              loginName: this.ruleForm.phone,
              password: this.ruleForm.password,
              phonenumber: this.ruleForm.phone,
              userId: this.ruleForm.userId
            })
              .then(rs => {
                if (rs.code === 0) {
                  this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                  this.getUserList();
                  this.addDialog = false;
                } else {
                  this.$message({
                    type: "error",
                    message: rs.msg
                  });
                  this.addDialog = false;
                }
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  type: "error",
                  message: "修改用户失败"
                });
                this.addDialog = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addUser() {
      this.oldPhone = "";
      this.titleTxt = "添加账号";
      this.ruleForm = {
        name: "",
        password: "",
        phone: ""
      };
      this.addDialog = true;
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getUserList(this.pagination.currentPage, this.pagination.size);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getUserList(this.pagination.currentPage, this.pagination.size);
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
