<template>
  <footer class="footer theme-color">
    <el-row>
      <p style="">©2019-2020 艺腾悠悠 Artent YoYo  京ICP备19024440号</p>
<!--      <el-col :span="15">-->
<!--        <p style="margin-left: 100px;">Copyright 2016 All rights reserved.</p>-->
<!--      </el-col>-->
<!--      <el-col :span="9">-->
<!--        <p>-->
<!--          <span>China: {{config["china-phone"]}}</span>-->
<!--          <span class="botton-margin">US: {{config["us-phone"]}}</span>-->
<!--          <span class="botton-margin">{{config["email"]}}</span>-->
<!--        </p>-->
<!--      </el-col>-->
    </el-row>
  </footer>
</template>
<script>
import config from "../common/config.json";
export default {
  data() {
    return {
      config: {}
    };
  },
  computed: {},
  methods: {},
  mounted() {
    this.config = config;
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  z-index: 200;
  text-align: center;
}
.botton-margin {
    margin-left: 20px;
}
</style>
