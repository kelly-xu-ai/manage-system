
<template>
  <section class="subuser">
    <el-button @click="addUser">添加账号</el-button>
    <el-select
      v-model="selectValue"
      placeholder="用户状态"
      size="mini"
      style="margin-left: 20px;"
      @change="selectChange"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px;"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column prop="organization" label="机构" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="loginName" label="手机号" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column label="状态" align="center" label-class-name="theme-color">
        <template slot-scope="scope">
          <span>{{ scope.row.delFlag==0 ? "正常":"停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="expirationDate"
        label="到期时间"
        align="center"
        label-class-name="theme-color"
      ></el-table-column>
      <el-table-column
        fixed="right"
        label="设置"
        width="500"
        align="center"
        label-class-name="theme-color"
      >
        <template slot-scope="scope">
          <el-button @click="lookSubList(scope.row.userId)" type="text" size="small">子账号列表</el-button>
          <el-button
            @click="lockUser(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.delFlag == 0"
          >冻结</el-button>
          <el-button
            @click="initUser(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.delFlag == 1"
          >恢复</el-button>

          <el-button @click="changeUser(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteUser(scope.row.userId)"
            style="color: #FF4949"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog :title="titleTxt" :visible.sync="addDialog" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="passwordRuleForm" class="ms-content">
        <el-form-item prop="organization" label="机构名称">
          <el-input v-model="ruleForm.organization" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="ruleForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="expirationDate" label="设置会员期限">
          <el-date-picker
            v-model="ruleForm.expirationDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            style="width: 100%;"
          ></el-date-picker>
          <!-- <el-select v-model="ruleForm.value" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
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
export default {
  name: "userManage",
  components: {},
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
      value: "",
      options: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "2",
          label: "已到期"
        },
        {
          value: "1",
          label: "冻结"
        }
      ],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
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
      tableData: [],
      ruleForm: {
        organization: "",
        name: "",
        password: "",
        phone: "",
        expirationDate: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        phone: [{ required: true, trigger: "blur", validator: checkPhone }],
        expirationDate: [
          { required: true, trigger: "blur", message: "请选择时间" }
        ]
      },
      pagination: {
        total: 0,
        size: 10,
        currentPage: 1
      },
      loading: false,
      oldPhone: "",
      titleTxt: "添加账号",
      selectValue: ""
    };
  },
  components: {},
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList(pageNum = 1, pageSize = 10, selectValue) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let obj = {
          pageNum: pageNum,
          pageSize: pageSize
        };
        if (selectValue) {
          obj.delFlag = selectValue;
        }
        getUserList(obj)
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
        delFlag: 0
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
      this.rules.name[0].required = false;
      this.rules.password[0].required = false;
      this.rules.phone[0].required = false;
      this.rules.expirationDate[0].required = false;
      this.titleTxt = "修改账号";
      this.oldPhone = row.loginName;
      this.ruleForm = {
        name: row.userName,
        password: row.password,
        phone: row.loginName,
        userId: row.userId,
        organization: row.organization,
        expirationDate: row.expirationDate
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
              phonenumber: this.ruleForm.phone,
              organization: this.ruleForm.organization,
              expirationDate: this.ruleForm.expirationDate
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
      this.ruleForm = {
        name: "",
        password: "",
        phone: "",
        organization: "",
        expirationDate: ""
      };
      this.addDialog = true;
      this.rules.name[0].required = true;
      this.rules.password[0].required = true;
      this.rules.phone[0].required = true;
      this.rules.expirationDate[0].required = true;
    },
    lookSubList(id) {
      this.$router.push(`/subUser?parentId=${id}`);
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getUserList(this.pagination.currentPage, this.pagination.size);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getUserList(this.pagination.currentPage, this.pagination.size);
    },
    selectChange() {
      this.getUserList(1, 10, this.selectValue);
    }
  }
};
// 处理时间格式
</script>

<style scoped>
</style>
<style>
.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
</style>
