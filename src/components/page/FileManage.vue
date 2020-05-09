
<template>
  <section class="fileManage">
    <el-row>
      <el-col :span="4" class="sidebar-el-menu el-menu" style="height: 100%;">
        <el-tree
          :data="treeList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          class="tree"
          accordion
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="categoryId"
          :default-expanded-keys="[categoryId?categoryId:'0']"
        ></el-tree>
      </el-col>
      <el-col :span="20" style="height: 850px;;background: #fff;" v-loading="loading">
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
            :on-error="handleUploadError"
          >
            <el-button size="small" type="primary" :disabled="addClassDisabled">上传文件</el-button>
          </el-upload>
          <el-button @click="addClassShow" style="float:left;margin-right:10px;">添加分类</el-button>
          <el-button
            @click="updataClass"
            :disabled="addClassDisabled"
            style="float:left;margin-right:10px;"
          >修改分类</el-button>
          <el-button
            @click="removeClass"
            :disabled="addClassDisabled"
            style="float:left;margin-right:10px;"
          >删除分类</el-button>
          <span v-if="addClassDisabled">
            <i class="el-icon-warning" style="color:#F7BA2A;margin-top:7px;"></i>
            <span style="font-size:12px;color:#475669;margin-left:5px;">先点击左侧树节点选择分类</span>
          </span>

          <el-input
            size="mini"
            placeholder="请输入名称"
            v-model="searchName"
            style="float:right;width:233px;"
            @keyup.enter.native = "fandFile"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="fandFile"></i>
          </el-input>
        </div>
        <el-table
          :data="fileData"
          style="width: 100%;margin-top: 10px;height: 680px;"
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
              <el-button
                @click="editFileClick(scope.row.id, scope.row.fileName)"
                type="text"
                size="small"
              >修改</el-button>
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
    <el-dialog :title="classTitle" :visible.sync="addClassDialog" width="400px" center>
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
        style="height: 450px;
  overflow-y: scroll;"
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
    <el-dialog title="文件修改" :visible.sync="updateFileDialog" width="400px" center>
      <el-form
        :model="fileForm"
        :rules="rules"
        ref="fileRuleForm"
        label-width="100px"
        class="ms-content"
      >
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="fileForm.fileName" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%;text-align:center;flex:bottom;">
        <el-button @click="editFile('fileRuleForm')" type="primary" class="theme-color">确定</el-button>
        <el-button @click="updateFileDialog=false">取消</el-button>
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
  changeFile,
  deleteClass,
  updateFile,
  updateClass
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
      searchName: "",
      currentNode: {
        categoryId: 0
      },
      rules: {
        categoryName: [
          { required: true, trigger: "blur", message: "请输入分类名称" }
        ],
        fileName: [
          { required: true, trigger: "blur", message: "请输入文件名称" }
        ]
      },
      fileData: [],
      treeList: [
        {
          categoryId: 0,
          categoryName: "分类管理",
          ancestors: -1,
          children: []
        }
      ],
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
        orderNum: "",
        categoryId: ""
      },
      updataData: {
        type: 1,
        categoryIds: 1
      },
      uploadUrl: "/api/file/add",
      multipleSelection: [],
      batchChange: false,
      tochangeId: "",
      originId: "",
      fileForm: {
        id: "",
        fileName: ""
      },
      updateFileDialog: false,
      classTitle: ""
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getFileList(this.categoryId , 1, 10);
      this.getTreeList();
    },
    getTreeList() {
      getTreelist()
        .then(rs => {
          this.treeList[0].children = rs;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "查询分类报错"
          });
        });
    },
    getFileList(
      categoryIds = null,
      pageNum = 1,
      pageSize = 10,
      fileName = this.searchName
    ) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getFilelist({
          categoryIds: categoryIds === 0 ? "" : categoryIds,
          pageNum: pageNum,
          pageSize: pageSize,
          fileName: fileName
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
          if (this.classTitle === "添加分类") {
            addCategory({
              categoryId: this.currentNode.categoryId,
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
          } else if (this.classTitle === "修改分类") {
            updateClass({
              categoryId: this.classForm.categoryId,
              categoryName: this.classForm.categoryName,
              orderNum: this.classForm.orderNum ? this.classForm.orderNum : 0
            })
              .then(rs => {
                if (rs.code === 0) {
                  this.init();
                  this.$message({
                    type: "success",
                    message: "编辑成功"
                  });
                  this.addClassDialog = false;
                  this.currentNode.categoryName = this.classForm.categoryName;
                  this.currentNode.orderNum = this.classForm.orderNum;
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
                  message: "编辑分类失败"
                });
              });
          }
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
      this.pagination.currentPage = 1;
      this.searchName = '';
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
      this.loading = false;
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
      this.loading = true;
      let nameList = file.name.split(".");
      let type = nameList[nameList.length - 1];
      let type0 = ["jpg", "png", "jpeg", "gif"];
      let type1 = ["mp4", "ogg"];
      let type2 = ["ppt", "pptx"];
      let type3 = ["doc", "docx"];
      let type4 = ["pdf"];
      let status = false;
      if (type0.includes(type)) {
        this.updataData.type = 0;
        status = true;
      }
      if (type1.includes(type)) {
        this.updataData.type = 1;
        status = true;
      }
      if (type2.includes(type)) {
        this.updataData.type = 2;
        status = true;
      }
      if (type3.includes(type)) {
        this.updataData.type = 3;
        status = true;
      }
      if (type4.includes(type)) {
        this.updataData.type = 4;
        status = true;
      }
      if (!status) {
        this.$message({
          type: "error",
          message:
            "您上传的文件格式不支持，文件支持格式（jpg,png,jpeg,gif,mp4,ogg,ppt,pptx,doc,docx,pdf）"
        });
      }
      return status;
    },
    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: "warning",
          message: "请先勾选要删除的课件!"
        });
      } else {
        this.deleteFile(this.getids());
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
    },
    removeClass() {
      this.$confirm("确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteClass({ categoryId: this.categoryId })
            .then(rs => {
              if (rs.code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.init();
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
    handleUploadError() {
      this.loading = false;
    },
    editFileClick(id, fileName) {
      this.fileForm.id = id;
      this.fileForm.fileName = fileName;
      this.updateFileDialog = true;
    },
    editFile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateFile({
            fileName: this.fileForm.fileName,
            id: this.fileForm.id
          })
            .then(rs => {
              if (rs.code === 0) {
                this.init();
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.updateFileDialog = false;
              } else {
                this.$message({
                  type: "error",
                  message: rs.msg
                });
                this.updateFileDialog = false;
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "添加文件失败"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addClassShow() {
      this.addClassDialog = true;
      this.classForm.categoryName = "";
      this.classForm.orderNum = "";
      this.classTitle = "添加分类";
    },
    updataClass() {
      this.addClassDialog = true;
      this.classTitle = "修改分类";
      this.classForm.categoryName = this.currentNode.categoryName;
      this.classForm.orderNum = this.currentNode.orderNum;
      this.classForm.categoryId = this.currentNode.categoryId;
    },
    fandFile() {
      this.getFileList(this.categoryId, 1, 10, this.searchName);
    }
  }
};

// 课件分类有问题
</script>

<style scoped lang="stylus">
.fileImg {
  width: 79px;
  height: 102px;
  cursor: pointer;
}
.tree {
  height: 850px;
  background: #d3dce6;
  overflow-y: auto;
  overflow-x: auto;
  >>>.el-tree-node{
    > .el-tree-node__children{
      overflow visible
    }
  }
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
