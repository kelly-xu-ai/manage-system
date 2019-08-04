
<template>
  <div class="login-wrap">
    <div class="ms-login" v-show="!(passwordDialogVisible||resetDialog)">
      <div class="ms-title theme-color">客户端登录</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="loginRuleForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-button
          type="text"
          class="theme-font"
          style="float: right;margin-bottom: 10px;"
          @click="forgetButton"
        >忘记密码</el-button>
        <div class="login-btn">
          <el-button type="primary" class="theme-color" @click="submitForm('loginRuleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="400px"
      center
      :show-close="false"
    >
      <p>
        您的会员已到期，请联系管理员重新续费后，
        <br />才能访问教务系统
      </p>
      <p style="width: 100%;text-align: right;">管理员电话：138********</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="theme-color" @click="noticeDialogVisible=false">我知道了</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="忘记密码"
      :visible.sync="passwordDialogVisible"
      width="400px"
      center
      :show-close="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="randomRuleForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="手机号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="14">
            <el-form-item prop="random">
              <el-input
                placeholder="输入验证码"
                v-model="ruleForm.random"
                @keyup.enter.native="goNext('randomRuleForm')"
              >
                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button
              :disabled="randomDisable"
              :type="randomType"
              class="theme-color"
              @click="getRandom"
              style="float: right;width: 117px;"
            >{{randomText}}</el-button>
          </el-col>
        </el-row>

        <el-button
          type="text"
          class="theme-font"
          style="float: right;margin-bottom: 10px;"
          @click="returnLogin()"
        >返回登录</el-button>
        <div class="login-btn">
          <el-button type="primary" class="theme-color" @click="goNext('randomRuleForm')">下一步</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="忘记密码" :visible.sync="resetDialog" width="400px" center :show-close="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="passwordRuleForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item>
          <el-input v-model="ruleForm.password" placeholder="请输入密码">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="resetPassword">
          <el-input
            placeholder="请输入确认密码"
            v-model="ruleForm.resetPassword"
            @keyup.enter.native="goNext('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-button
          type="text"
          class="theme-font"
          style="float: right;margin-bottom: 10px;"
          @click="passwordDialogVisible=false;resetDialog=false"
        >返回登录</el-button>
        <div class="login-btn">
          <el-button
            type="primary"
            class="theme-color"
            @click="resetPassword('passwordRuleForm')"
          >完成</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { setPriority } from "os";
import {
  login,
  getUserInfo,
  getPhoneRandom,
  sendMessage,
  verifyCode,
  forgetPwd
} from "../../api/index";
export default {
  data: function() {
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
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      this.checkPassword().then(rep => {
        if (rep.code === 0) {
          return callback();
        }
        return callback(new Error(rep.msg));
      });
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    let checkRandom = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        verifyCode({ phoneNumber: this.ruleForm.phone, code: value })
          .then(rs => {
            if (rs.code !== 0) {
              callback(new Error(rs.msg));
            } else {
              callback();
            }
          })
          .catch(err => {
            console.log(err, "校验验证码失败");
            callback(new Error(rs.msg));
          });
      }
    };
    return {
      ifAdmin: false,
      ifMain: false,
      expirationDate: "",
      noticeDialogVisible: false,
      passwordDialogVisible: false,
      ifEnoughMoney: false,
      randomDisable: false,
      resetDialog: false,
      randomText: "获取验证码",
      randomType: "primary",
      ruleForm: {
        username: "",
        password: "",
        resetPassword: "",
        phone: "",
        random: ""
      },
      rules: {
        username: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [
          { required: true, trigger: "blur", validator: checkPassword }
        ],
        phone: [{ required: true, trigger: "blur", validator: checkPhone }],
        random: [{ required: true, trigger: "blur", validator: checkRandom }],
        resetPassword: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        onePassword: [
          { required: true, trigger: "blur", message: "请输入密码" }
        ]
      }
    };
  },
  mounted() {
    this.init();
    if (this.$route.query.ifForgetPassword) {
      this.forgetButton();
    }
  },
  methods: {
    init() {},
    toLogin() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkIfEnoughMoney().then(() => {
            if (!this.ifEnoughMoney) {
              this.noticeDialogVisible = true;
            } else {
              if (this.ifAdmin) {
                this.$router.push("/userManage");
              } else {
                this.$router.push("/file");
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    checkIfEnoughMoney() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(rs => {
            if (rs.code !== 0) {
              if (rs.code === 401) {
                this.$router.push("/login");
              }
              reject("查询用户信息失败");
              this.$message({
                type: "error",
                message: rs.msg
              });
            }
            this.ifAdmin = rs.data.user.admin;
            this.ifMain = rs.data.user.main;
            this.expirationDate = rs.data.user.expirationDate;
            localStorage.setItem("ms_username", rs.data.user.userName);
            localStorage.setItem("ifAdmin", rs.data.user.admin);
            localStorage.setItem("ifMain", rs.data.user.main);
            localStorage.setItem("loginName", rs.data.user.loginName);
            if (this.ifAdmin) {
              this.ifEnoughMoney = true;
            } else {
              let curretTime = new Date();
              if (
                new Date(Date.parse(curretTime)) >
                new Date(Date.parse(this.expirationDate))
              ) {
                this.ifEnoughMoney = false;
              } else {
                this.ifEnoughMoney = true;
              }
            }
            resolve();
          })
          .catch(err => {
            console.log(err, "查询用户信息失败");
          });
      });
    },
    checkUser() {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    checkPassword() {
      return new Promise((resolve, reject) => {
        login({
          username: this.ruleForm.username,
          password: this.ruleForm.password
        })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getRandom() {
      this.randomDisable = true;
      let time = 60;
      let self = this;
      let set = setInterval(function() {
        self.randomText = `${--time}秒后重新获取`;
        self.randomType = "info";
      }, 1000);
      setTimeout(function() {
        self.randomDisable = false;
        self.randomType = "primary";
        self.randomText = "重新获取验证码";
        clearInterval(set);
      }, 60 * 1000);
      sendMessage({ phoneNumber: this.ruleForm.phone })
        .then(rs => {
          if (rs.code !== 0) {
            this.$message({
              type: "error",
              message: rs.msg
            });
          } else {
            this.$message({
              type: "success",
              message: rs.msg
            });
          }
        })
        .catch(err => {
          console.log(err, "更新密码失败");
          this.$message({
            type: "error",
            message: err
          });
        });
    },
    goNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.resetDialog = true;
          this.passwordDialogVisible = false;
          this.ruleForm.password = "";
        } else {
          console.log("error goNext!!");
          return false;
        }
        /*   this.resetDialog = true;
        this.passwordDialogVisible = false;
        this.ruleForm.password = ""; */
      });
    },
    resetPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          forgetPwd({
            code: this.ruleForm.random.trim(),
            newPassword: this.ruleForm.resetPassword.trim()
          })
            .then(rs => {
              if (rs.code !== 0) {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
                this.$router.push("/login");
              } else {
                this.$message({
                  type: "success",
                  message: rs.msg
                });
              }
            })
            .catch(err => {
              console.log(err, "更新忘记密码失败");
              this.$message({
                type: "error",
                message: err
              });
            });
        } else {
          console.log("error password!!");
          return false;
        }
      });
    },
    forgetButton() {
      this.passwordDialogVisible = true;
      this.ruleForm = {
        username: "",
        password: "",
        resetPassword: "",
        phone: "",
        random: ""
      };
    },
    returnLogin(formName) {
      this.passwordDialogVisible = false;
      this.resetDialog = false;
      /* this.$refs[formName].resetFields();
      // this.$refs[formName].resetFields(); */
      this.$refs["randomRuleForm"].resetFields();
      // this.$refs["passwordRuleForm"].resetFields();
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.png);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 75%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
  padding: 30px 30px 10px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
<style>
.el-dialog__header {
  padding: 10px 20px 10px;
}

.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
#app .el-button--info.is-disabled,
#app .el-button--info.is-disabled:active,
#app .el-button--info.is-disabled:focus,
#app .el-button--info.is-disabled:hover {
  color: #fff;
  background-color: #c8c9cc;
  border-color: #c8c9cc;
}
</style>
