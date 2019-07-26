
<template>
  <section class="fileManage">
    <el-row>
      <el-col :span="4" class="sidebar-el-menu el-menu" style="height: 100%;">
        <el-tree :data="treeList" :props="defaultProps" @node-click="handleNodeClick" class="tree"></el-tree>
      </el-col>
      <el-col
        :span="20"
        style="height: 850px;;background: #fff;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <div style="margin: 10px;">
          <!-- <el-button
            @click="addFile"
            type="primary"
            class="theme-color"
            :disabled="updateDisabled"
          >上传文件</el-button>-->

          <!-- <el-upload
            class="upload-demo"
            action="/file/add"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :data="updataData"
          >
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload> -->

          <el-button @click="addClassDialog=true" :disabled="addClassDisabled">添加分类</el-button>
        </div>
        <el-table
          :data="fileData"
          style="width: 100%;margin-top: 10px;"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="fileName"
            label="文件名"
            align="center"
            label-class-name="theme-color"
          ></el-table-column>
          <el-table-column label="图标" align="center" label-class-name="theme-color">
            <template slot-scope="scope">
              <img :src="getIcon(scope.row.type)" alt="file.fileName" class="fileImg" />
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改日期"
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
              <el-button @click="changeFile(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">移动</el-button>
              <el-button type="text" size="small" @click="deleteFile" style="color: #FF4949">删除</el-button>
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
      </el-col>
    </el-row>
    <el-dialog title="添加分类" :visible.sync="addClassDialog" width="400px" center>
      <el-form
        :model="classForm"
        :rules="rules"
        ref="classRuleForm"
        class="ms-content"
        label-width="100px"
      >
        <el-form-item prop="categoryName" label="分类名称">
          <el-input v-model="classForm.categoryName" placeholder="点击输入，最大不超过20字"></el-input>
        </el-form-item>
        <el-form-item prop="orderNum" label="排序">
          <el-input v-model="classForm.orderNum" placeholder="排序值越大越靠前，不填写默认为0"></el-input>
        </el-form-item>
        <!--  <el-form-item prop="icon" label="图标">
          <el-input v-model="classForm.password" placeholder="请输入图标"></el-input>
        </el-form-item>-->
        <div class="login-btn" style="text-align:center;">
          <el-button type="primary" class="theme-color" @click="addClass('classRuleForm')">确定</el-button>
          <el-button @click="addClassDialog=false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { getFilelist, getTreelist, addCategory } from "../../api/index.js";
import pic from "../../assets/img/pic.jpeg";
import dv from "../../assets/img/dv.jpeg";
import ppt from "../../assets/img/ppt.jpeg";
import doc from "../../assets/img/doc.jpeg";
import pdf from "../../assets/img/pdf.jpeg";
export default {
  name: "fileManage",
  data() {
    return {
      addDialog: false,
      addClassDialog: false,
      currentNode: {},
      rules: {
        categoryName: [
          { required: true, trigger: "blur", message: "请输入分类名称" }
        ]
      },
      fileData: [],
      treeList: [],
      defaultProps: {
        children: "children",
        label: "categoryName"
      },
      iconList: {
        "0": pic,
        "1": dv,
        "2": ppt,
        "3": doc,
        "4": pdf
      },
      pagination: {
        total: 0,
        size: 10,
        currentPage: 1
      },
      categoryId: 0,
      loading: false,
      updateDisabled: true,
      addClassDisabled: true,
      classForm: {
        categoryName: "",
        orderNum: ""
      },
      updataData: {}
    };
  },
  components: {},
  mounted() {
    this.getFileList(null, 1, 10);
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      getTreelist()
        .then(rs => {
          this.treeList = rs;
          if (rs.length) {
            this.categoryId = rs[0].categoryId;
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: rs.msg
          });
        });
    },
    getFileList(categoryIds = 1, pageNum = 1, pageSize = 10) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getFilelist({
          categoryIds: categoryIds,
          pageNum: pageNum,
          pageSize: pageSize
        })
          .then(rs => {
            this.pagination.total = rs.total;
            if (rs.code === 0) {
              this.fileData = rs.rows;
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
    changeFile(row) {},
    deleteFile() {
      this.$confirm("确定要删除吗", "提示", {
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
    addFile() {},
    addClass(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addCategory({
            parentId: this.currentNode.parentId,
            categoryName: this.classForm.categoryName,
            orderNum: this.classForm.orderNum ? this.classForm.orderNum : 0
          })
            .then(rs => {
              if (rs.code === 0) {
                this.mounted();
                this.$message({
                  type: "error",
                  message: "添加成功"
                });
              } else {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
                reject(rs.msg);
              }
            })
            .catch(err => {
              reject(err);
              this.$message({
                type: "error",
                message: "添加分类失败"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    remove() {},
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getFileList(
        this.categoryId,
        this.pagination.currentPage,
        this.pagination.size
      );
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getFileList(
        this.categoryId,
        this.pagination.currentPage,
        this.pagination.size
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(data) {
      console.log(data);
      this.currentNode = data;
      this.updateDisabled = false;
      this.addClassDisabled = false;
      this.categoryId = data.categoryId;
      this.getFileList(
        this.categoryId,
        this.pagination.currentPage,
        this.pagination.size
      );
    },
    getIcon(type) {
      return this.iconList[type];
    },
    openFile(url) {
      console.log(url);
      window.open(url, "_blank");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>

<style scoped>
.fileImg {
  width: 79px;
  height: 102px;
  cursor: pointer;
}
.tree {
  height: 850px;
  background: #d3dce6;
}
.fileImg {
  width: 20px;
  height: 20px;
  cursor: initial;
}
</style>
<style>
.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
</style>
