<template>
  <section class="subuser">
    <el-button @click="addFile">上传文件</el-button>
    <el-button @click="addClass">添加分类</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fileName" label="文件名" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" label-class-name="theme-color"></el-table-column>
      <el-table-column prop="dateTime" label="修改日期" align="center" label-class-name="theme-color"></el-table-column>
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
          <el-button type="text" size="small" @click="deleteFile">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      current-page.sync="10"
      :page-size="100"
      layout="total, prev, pager, next"
      :total="1000"
      style="margin-top:20px;"
    ></el-pagination>
  </section>
</template>

<script>
export default {
  name: "fileManage",
  data() {
    return {
      addDialog: false,
      tableData: [
        {
          icon: "22222",
          fileName: "王小虎",
          dateTime: "dddd"
        },
        {
          icon: "444",
          fileName: "王小虎",
          dateTime: "cccc"
        },
        {
          icon: "4555",
          fileName: "王小虎",
          password: "rrr"
        },
        {
          icon: "6666",
          fileName: "王小虎",
          dateTime: "cccc"
        }
      ]
    };
  },
  components: {},
  mounted() {
    this.getFileList();
  },
  methods: {
    getFileList() {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    changeFile(row) {
    },
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
