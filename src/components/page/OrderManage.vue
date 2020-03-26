
<template>
  <section class="subuser">
    <div>
      <el-radio v-model="radio1" label="1" border @change="selectChange">全部</el-radio>
      <el-radio v-model="radio1" label="2" border @change="selectChange">已支付</el-radio>
      <el-radio v-model="radio1" label="3" border @change="selectChange">未支付</el-radio>
    </div>
    <div class="block" style="margin-top: 10px">
      <el-date-picker
              v-model="fromTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px;"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column prop="id" label="订单编号" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="postTitle" label="产品名称" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="totalAmount" label="金额（￥）" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" :formatter="stateFormat" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="userName" label="用户" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="createTime" label="时间" align="center" label-class-name="theme-color"></el-table-column>
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
    <el-dialog
      :title="titleTxt"
      :visible.sync="addDialog"
      width="400px"
      center
      :close-on-click-modal="false"
    >
      <el-form :model="ruleForm" :rules="rules" ref="passwordRuleForm" class="ms-content">

        <el-form-item prop="name" label="用户名">
          <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="ruleForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="ruleForm.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

          <!-- <el-select v-model="ruleForm.value" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
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
  oderList,
  checkLoginNameUnique,
} from "../../api/index.js";
export default {
  name: "orderManage",
  components: {},
  data() {
    let checkUser = (rule, value, callback) => {
      if (!value && this.rules.name[0].required) {
        return callback(new Error("请输入用户名"));
      }
      callback();
    };
    let checkPhone = (rule, value, callback) => {
      if (!this.rules.phone[0].required && !value) {
        return callback();
      }
      if (!value) {
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
      fromTime:[],
      rules: {
        name: [{ required: true, trigger: "blur", validator: checkUser }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        phone: [{ required: true, trigger: "blur", validator: checkPhone }],
        expirationDate: [
          { required: true, trigger: "blur", message: "请选择时间" }
        ]
      },
      radio1 : 0,
      radio1Status : '',
      tableData: [],
      ruleForm: {
        name: "",
        password: "",
        phone: "",
        email:""
      },
      OrderFrom:{
        status:"",
        startDate:"",
        endDate:""
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
    this.getOderList();
  },
  methods: {
    getOderList(pageNum = 1, pageSize = 10, order) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let obj = {
          pageNum: pageNum,
          pageSize: pageSize
        };
        if (this.fromTime) {
          obj.startDate = this.fromTime[0];
          obj.endDate = this.fromTime[1];
        }
        if (order) {
          console.error(order.status);
          obj.startDate = order.startDate,
          obj.endDate = order.endDate,
          obj.status = order.status
        }
        oderList(obj)
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
    stateFormat(row, column) {
      if (row.status === 1) {
        return  '已支付'
      }else {
        return  '未支付'
      }
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getOderList(this.pagination.currentPage, this.pagination.size);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getOderList(this.pagination.currentPage, this.pagination.size);
    },
    selectChange(val) {
      console.error(val);
      let obj = {};
      if (this.fromTime) {
        obj.startDate = this.fromTime[0];
        obj.endDate = this.fromTime[1];
      }
      if (val === '1') {
        this.getOderList(1, 10);
      }else if (val === '2') {
        this.radio1Status = 1;

          obj.status = 1;

        this.getOderList(1, 10, obj);
      }else if (val === '3') {
        this.radio1Status = 0;
        obj.status = 0;
        this.getOderList(1, 10, obj);
      }else {
        this.getOderList(1, 10, obj);
      }
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
