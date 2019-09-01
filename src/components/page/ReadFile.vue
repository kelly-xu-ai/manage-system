
<template>
  <div id="readFile" v-loading="loading" element-loading-text="拼命加载中" style="padding-top:10px;">
    <template v-for="item in dataFile" v-show="type==2||type==3||type==4">
      <img v-lazy="item" :key="item" />
    </template>
    <img :src="imageUrl" v-show="type==0" />
    <video
      :src="imageUrl"
      controls
      controlslist="nodownload"
      v-show="type==1"
      style="marin-top:10px;"
    ></video>
  </div>
</template>

<script>
import request from "../../utils/request";
import { readFile } from "../../api/index";
export default {
  data: function() {
    return {
      loading: false,
      fileId: null,
      dataFile: [],
      imageUrl: "",
      type: null
    };
  },
  mounted() {
    this.init();
    function blockright(oEvent) {
      if (window.event) {
        oEvent = window.event; //处理兼容性，获得事件对象
        oEvent.returnValue = false;
      } else oEvent.preventDefault();
    }
    window.onload = function() {
      document.oncontextmenu = blockright;
    };

    //禁用页面的ctrl功能，来禁止ctrl+s保存功能
    window.addEventListener("keydown", function(e) {
      if (
        e.keyCode == 83 &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
      }
    });
  },
  methods: {
    init() {
      this.fileId = this.$route.query.fileId;
      if (this.fileId) {
        this.loading = true;
        readFile({
          id: this.fileId
        })
          .then(rs => {
            if (rs.code === 0) {
              let type = rs.data && rs.data.type;
              this.type = type;
              let channelId = rs.data && rs.data.channelId;
              let url = rs.data && rs.data.url;
              // 0: 图片， 1:视频， 2、3、4: 图片集
              if (type == 0) {
                this.imageUrl = `/profile/${url}`;
              } else if (type == 1) {
                this.imageUrl = `/profile/${url}`;
              } else {
                for (let i = 0; i < channelId; i++) {
                  this.dataFile.push(`profile/image/${url}/image_${i}.jpg`);
                }
              }
            } else {
              this.$message({
                type: "error",
                message: rs.msg
              });
            }
            this.loading = false;
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err
            });
            this.loading = false;
          });
      }
    },
    readFile() {}
  }
};
</script>

<style scoped>
#readFile {
  text-align: center;
  background-color: gray;
  height: 100%;
}
#readFile img {
  background-color: #fff;
  text-align: center;
  width: 1280px;
  height: 720px;
  margin-top: 6px;
}
</style>
<style>
</style>
