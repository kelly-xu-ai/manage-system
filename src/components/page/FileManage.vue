
<template>
  <section class="fileManage">
    <el-row>
      <el-col :span="4" class="sidebar-el-menu el-menu" style="height: 100%;">
        <el-tree
          :data="treeList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          class="tree"
          :default-expand-all="true"
          :highlight-current="true"
        ></el-tree>
      </el-col>
      <el-col
        :span="20"
        style="height: 850px;;background: #fff;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <div style="margin: 10px;">
          <el-button style="float:left;" @click="batchDelete">删除</el-button>
          <el-button style="float:left;margin-right: 20px;margin-left: 20px;" @click="batchMove">移动</el-button>
          <el-upload
            class="upload-demo"
            style="float:left;margin-right:20px;"
            :action="uploadUrl"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
            :data="updataData"
            :disabled="addClassDisabled"
            :show-file-list="false"
          >
            <el-button size="small" type="primary" :disabled="addClassDisabled">上传文件</el-button>
          </el-upload>

          <el-button
            @click="addClassDialog=true"
            :disabled="addClassDisabled"
            style="float:left;margin-right:10px;"
          >添加分类</el-button>
          <span v-if="addClassDisabled">
            <i class="el-icon-warning" style="color:#F7BA2A;margin-top:7px;"></i>
            <span style="font-size:12px;color:#475669;margin-left:5px;">先点击左侧树节点选择分类</span>
          </span>
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
              <el-button @click="moveFile(scope.row.id)" type="text" size="small">移动</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteFile(scope.row.id)"
                style="color: #FF4949"
              >删除</el-button>
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
    <el-dialog title="移动到" :visible.sync="batchChange" width="400px" center>
      <el-tree
        :data="treeList"
        :props="defaultProps"
        @node-click="getToChange"
        :default-expand-all="true"
        :highlight-current="true"
      ></el-tree>
      <div class="login-btn" style="text-align:center;">
        <el-button
          type="primary"
          class="theme-color"
          @click="changeFile(tochangeId)"
          :disabled="tochangeId===''"
        >确定</el-button>
        <el-button @click="batchChange=false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getFilelist,
  getTreelist,
  addCategory,
  removeFile,
  changeFile
} from "../../api/index.js";
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
      categoryId: null,
      loading: false,
      updateDisabled: true,
      addClassDisabled: true,
      classForm: {
        categoryName: "",
        orderNum: ""
      },
      updataData: {
        type: 1,
        categoryIds: 1
      },
      uploadUrl: "/api/file/add",
      multipleSelection: [],
      batchChange: false,
      tochangeId: "",
      originId: ""
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getFileList(null, 1, 10);
      this.getTreeList();
    },
    getTreeList() {
      getTreelist()
        .then(rs => {
          this.treeList = rs;
          if (rs.length) {
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: rs.msg
          });
        });
    },
    getFileList(categoryIds = null, pageNum = 1, pageSize = 10) {
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
    deleteFile(id) {
      this.$confirm("确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeFile({ ids: id })
            .then(rs => {
              if (rs.code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getFileList(this.categoryId, 1, this.pagination.size);
              } else {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "删除失败"
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
    changeFile(toid) {
      changeFile({ ids: this.originId, cIds: toid })
        .then(rs => {
          if (rs.code === 0) {
            this.$message({
              type: "success",
              message: "移动成功!"
            });
            this.getFileList(this.categoryId, 1, this.pagination.size);
            this.batchChange = false;
          } else {
            this.$message({
              type: "error",
              message: rs.msg
            });
            this.batchChange = false;
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "删除失败"
          });
          this.batchChange = false;
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
                this.init();
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.addClassDialog = false;
              } else {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
                this.addClassDialog = false;
              }
            })
            .catch(err => {
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
      this.currentNode = data;
      this.updateDisabled = false;
      this.addClassDisabled = false;
      this.categoryId = data.categoryId;
      this.getFileList(
        this.categoryId,
        this.pagination.currentPage,
        this.pagination.size
      );
      this.updataData.categoryIds = `${data.ancestors},${data.categoryId}`;
    },
    getIcon(type) {
      return this.iconList[type];
    },
    openFile(url) {
      console.log(url);
      window.open(url, "_blank");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.getFileList(
          this.categoryId,
          this.pagination.currentPage,
          this.pagination.size
        );
      } else {
        this.$message({
          type: "error",
          message: "添加失败"
        });
      }
    },
    handleBeforeUpload(file) {
      let fileType = file.type.split("/");
      console.log(fileType);
      if (fileType[0] === "image") {
        this.updataData.type = 0;
      } else if (fileType[0] === "video") {
        this.updataData.type = 1;
      } else if (fileType[0] === "application") {
        if (fileType[1].includes("pdf")) {
          this.updataData.type = 2;
        }
        if (fileType[1].includes("document")) {
          this.updataData.type = 3;
        }
        if (fileType[1].includes("presentation")) {
          this.updataData.type = 4;
        }
      } else {
        this.$message({
          type: "error",
          message: "添加的文件类型不支持"
        });
        return false;
      }
    },
    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: "warning",
          message: "请先勾选要删除的课件!"
        });
      } else {
        this.deleteFile(getids());
      }
    },
    batchMove() {
      this.tochangeId = "";
      if (!this.multipleSelection.length) {
        this.$message({
          type: "warning",
          message: "请先勾选要移动的课件!"
        });
      } else {
        this.batchChange = true;
        this.originId = this.getids();
      }
    },
    getToChange(node) {
      this.tochangeId = `${node.ancestors},${node.categoryId}`;
    },
    getids() {
      let idList = [];
      this.multipleSelection.forEach(val => {
        idList.push(val.id);
      });
      return idList.join(",");
    },
    moveFile(id) {
      this.tochangeId = "";
      this.originId = id;
      this.batchChange = true;
    }
  }
};

// 课件分类有问题
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
.el-upload {
  width: 80px;
  height: 33px;
  border: none;
}
</style>
