<template>
  <section class="subuser">
    <el-row>
      <el-col
        :span="6"
        class="sidebar-el-menu el-menu"
        style="background-color: rgb(50, 65, 87);height: 100%;"
      >
        <el-tree :data="treeList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="18">
        <div style="height: 100%;">
          <template v-for="(file, index) in fileData">
            <div :key="index" style="float:left;margin-right:94px;">
              <img :src="getIcon(file.type)" alt="file.fileName" style="width:79px;height: 102px;" />
              <p>{{file.fileName}}</p>
            </div>
          </template>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          current-page.sync="10"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="1000"
          style="margin-top:20px;"
        ></el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { getFilelist } from "../../api/index.js";
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
      treeList: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      iconList: {
        "0": pic,
        "1": dv,
        "2": ppt,
        "3": doc,
        "4": pdf
      }
    };
  },
  components: {},
  mounted() {
    this.getFileList();
  },
  methods: {
    getFileList(categoryIds = 1, pageNum = 1, pageSize = 10) {
      return new Promise((resolve, reject) => {
        // categoryIds: categoryIds ,
        getFilelist({ pageNum: pageNum, pageSize: pageSize })
          .then(rs => {
            console.log(rs);
            if (rs.code === 0) {
              this.fileData = rs.rows;
              console.log(this.fileData);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(data) {
      console.log(data);
    },
    getIcon(type) {
      return this.iconList[type];
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
