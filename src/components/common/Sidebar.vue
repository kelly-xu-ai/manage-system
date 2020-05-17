
<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template>
          <el-menu-item :index="item.index" :key="item.index" v-show="!item.subs && item.show">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { fail } from "assert";
import { getUserInfo } from "../../api/index";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          index: "file",
          title: "课件",
          show: true,
          icon: 'el-icon-lx-file'
        },
        {
          index: "user",
          title: "主账号信息",
          show: false,
          icon: 'el-icon-lx-profile'
        },
        {
          index: "subUser",
          title: "子账号管理",
          show: false,
          icon: 'el-icon-lx-friend'
        },
        {
          index: "userManage",
          title: "用户管理",
          show: false,
          icon: 'el-icon-lx-group'
        },
        {
          index: "fileManage",
          title: "课件管理",
          show: false,
          icon: 'el-icon-lx-calendar'
        }
      ],
      ifShow: false,
      ifAdmin: "", // 因为从localstoge是字符串
      ifMain: ""
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  },
  mounted() {
    this.ifAdmin = localStorage.getItem("ifAdmin");
    this.ifMain = localStorage.getItem("ifMain");
    if (this.ifAdmin === "true") {
      this.items[0].show = true;
      this.items[1].show = false; // 主账号信息
      this.items[2].show = false; // 子账号管理
      this.items[3].show = true;
      this.items[4].show = true;
    } else if (this.ifMain === "true") {
      this.items[1].show = true; // 主账号信息
      this.items[2].show = true; // 子账号管理
      this.items[0].show = true; // 课件
    } else {
        this.items[3].show = false; // 用户管理
        this.items[4].show = false; // 课件管理
        this.items[0].show = true; // 课件
    }
  },
  watch: {
    "$route.path": {
      handler(newValue, oldValue) {
        if (
          this.ifAdmin === "false" &&
          this.ifMain === "true" &&
          newValue === "/user"
        ) {
          this.items[1].show = true;
          this.items[2].show = true;
          // 主账号点击个人中心只显示主账号信息，子账号管理
          this.items[0].show = true;
          this.items[3].show = false;
          this.items[4].show = false;
        }
      }
    },
    deep: true
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
