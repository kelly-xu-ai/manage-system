
<template>
  <section class="subuser">
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
        <div style="display: flex;flex-wrap: wrap;">
          <template v-for="(file, index) in fileData">
            <div :key="index" style="float:left;margin:30px;">
              <img
                :src="getIcon(file.type)"
                alt="file.fileName"
                class="fileImg"
                @click="openFile(file.url)"
              />
              <p style="font: 12px;">{{file.fileName}}</p>
            </div>
          </template>
        </div>
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
      loading: false
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
    addFile() {
      this.addDialog = true;
    },
    addClass() {},
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
      window.open('/profile/' + url, "_blank");
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
</style>
<style>
.el-dialog__title {
  color: #fff;
  font-size: 16px;
}
</style>
