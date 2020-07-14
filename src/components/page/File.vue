
<template>
  <section class="subuser">
    <el-row>
      <el-col :span="4" class="sidebar-el-menu el-menu" style=" height: 100%;">
        <el-tree
          :data="treeList"
          :expand-on-click-node="false"
          accordion
          :props="defaultProps"
          @node-click="handleNodeClick"
          class="tree"
        ></el-tree>
      </el-col>
      <el-col
        :span="20"
        style="height:auto; min-height: 850px; background: #fff;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
          <el-input
                  size="mini"
                  placeholder="请输入名称"
                  v-model="searchName"
                  style="width:233px; position: relative;margin-top: 10px;margin-left: 30px"
                  @keyup.enter.native = "fandFile"
          >
              <i slot="prefix" class="el-input__icon el-icon-search" @click="fandFile"></i>
          </el-input>
        <div style="display: flex;flex-wrap: wrap; margin-bottom: 50px">
          <template v-for="(file, index) in fileData">
            <div :key="index" style="float:left;margin:30px;width:170px;overflow:hidden;text-align: center;">
              <img
                :src="file.type === '0' ? '/profile/pre/' + file.url : (file.type === '4' ? '/profile/image/' + file.url + '/image_0_0.jpg' : getIcon(file.type))"
                alt="file.fileName"
                class="fileImg"
                @click="openFile(file.id)"
              />
              <p style="font: 12px;text-align: center;">{{file.fileName}}</p>
            </div>
          </template>
        </div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            style="position: absolute;bottom: 15px;margin-left: 20px;"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { getFilelist, getTreelist } from "../../api/index.js";
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
      fileData: [],
      treeList: [],
      searchName: "",
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
      loading: false
    };
  },
  components: {},
  mounted() {
    this.getFileList(null, 1, 20);
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      getTreelist()
        .then(rs => {
          this.treeList = rs;
          if (rs.length) {
            // this.categoryId = rs[0].categoryId;
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: rs.msg
          });
        });
    },
    getFileList(categoryIds = 1, pageNum = 1, pageSize = 20,
                fileName = this.searchName) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getFilelist({
          categoryIds: categoryIds,
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
    addFile() {
      this.addDialog = true;
    },
    addClass() {},
    remove() {},
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getFileList(this.categoryId, this.pagination.currentPage);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getFileList(this.categoryId, this.pagination.currentPage);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(data) {
      console.log(data);
      this.categoryId = data.categoryId;
      this.searchName = "";
      this.getFileList(this.categoryId, this.pagination.currentPage);
    },
    getIcon(type) {
      return this.iconList[type];
    },
    openFile(id) {
      let routeData = this.$router.resolve({ path: `/readFile?fileId=${id}` });
      window.open(routeData.href, "_blank");
    },
    fandFile() {
      this.getFileList(this.categoryId, 1, 20, this.searchName);
    }
  }
};
</script>

<style scoped lang="stylus">
.fileImg {
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
</style>
<style>
.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
</style>
