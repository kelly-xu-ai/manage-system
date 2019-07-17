

<template>
  <div style="height:100%;">
    <el-row>
      <el-col :span="3">
        <div class="lable theme-color lable-border">用户名</div>
      </el-col>
      <el-col :span="21">
        <div class="content-sider">{{user.name}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <div class="lable theme-color lable-border">手机号</div>
      </el-col>
      <el-col :span="21">
        <div class="content-sider">{{user.phone}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <div class="lable theme-color lable-border">会员到期时间</div>
      </el-col>
      <el-col :span="21">
        <div class="content-sider">{{user.endDate}}</div>
      </el-col>
    </el-row>
    <el-row class="theme-color">
      <el-col :span="3" style="height:100%;">
        <div class="lable theme-color" style="padding-bottom: 1px;height: 100%;">账号密码</div>
      </el-col>
      <el-col :span="21" class="content-sider last-content" style="background:#f0f0f0;">
        <div>
          <span v-if="!ifShow" style="color: #000;">*******</span>
          <el-button
            type="primary"
            class="theme-color update-button"
            @click="ifShow=true"
            v-if="!ifShow"
            style="margin-right:50px;"
          >修改</el-button>
        </div>
        <el-form
          ref="user"
          :model="user"
          :rules="rules"
          v-if="ifShow"
          style="height:auto;padding-bottom: 50px;"
        >
          <el-row>
            <el-form-item prop="password" class="form-item">
              <el-input v-model="user.password" :placeholder="placeholderText"></el-input>
            </el-form-item>
            <el-form-item style="float:left;margin-left: 30px;" v-if="!ifShowReset">
              <el-button
                type="primary"
                class="theme-color update-button"
                style="float:left;"
                @click="confirmPassword('user')"
              >确定</el-button>
              <el-button class="update-button" style="float:left;margin-left:30px;">取消</el-button>
            </el-form-item>
          </el-row>
          <el-row v-if="!ifShowReset">
            <el-button
              type="text"
              class="theme-font"
              style="float: left;margin-top:-20px;margin-left: 200px;"
              @click="forgetButton"
            >忘记密码</el-button>
          </el-row>
          <el-row v-if="ifShowReset">
            <el-form-item prop="resetPassword" class="form-item">
              <el-input
                placeholder="请输入确认密码"
                v-model="user.resetPassword"
                @keyup.enter.native="resetPassword('user')"
              ></el-input>
            </el-form-item>
            <el-form-item style="float:left;margin-left: 30px;" v-if="ifShowReset">
              <el-button
                type="primary"
                class="theme-color update-button"
                style="float:left;"
                @click="resetPassword('user')"
              >确定</el-button>
              <el-button class="update-button" style="float:left;margin-left:30px;">取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      this.checkPassword().then(rep => {
        if (!rep) {
          return callback(new Error("密码错误"));
        }
        return callback();
      });
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [
          { required: true, trigger: "blur", validator: checkPassword }
        ],
        resetPassword: [
          { required: true, trigger: "blur", validator: validatePass }
        ]
      },
      user: {
        name: "樱桃小丸子",
        phone: "13810745017",
        endDate: "2020-03-21",
        password: "",
        resetPassword: ""
      },
      ifShow: false,
      ifShowReset: false,
      placeholderText: "请输入当前登录密码"
    };
  },
  methods: {
    updatePassword() {
      this.ifShow = true;
    },
    checkPassword() {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    forgetButton() {
      this.$router.push({ path: "/login?ifForgetPassword=true" });
    },
    resetPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log("error password!!");
          return false;
        }
      });
    },
    confirmPassword(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.ifShowReset = true;
          self.placeholderText = "请输入密码";
          self.user.password = "";
        } else {
          console.log("error password!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scope>
.lable {
  min-height: 50px;
  line-height: 50px;
  text-align: center;
}
#app .lable-border {
  border-bottom: 1px solid #fff;
}
.content-sider {
  min-height: 50px;
  line-height: 50px;
  border-top: 1px solid #99a9bf;
  border-right: 1px solid #99a9bf;
  padding-left: 20px;
}
.last-content {
  border-bottom: 1px solid #99a9bf;
}
.update-button {
  float: right;
  margin-top: 10px;
  padding: 9px 30px;
}

.form-item {
  width: 250px;
  float: left;
  padding-top: 8px;
}
</style>