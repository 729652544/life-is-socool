<template>
  <div class="navInfo">
    <common-bread class="topBread" :aryBread="aryBread"></common-bread>
    <div class="infoContent">
      <div class="topOperField"><el-button type="primary" @click="returnList">返回</el-button>
      </div>
      <div class="infoData">
        <span class="iconfont icon-gongdan headerSpan" id="spnJoin">&nbsp;任务详情</span>

        <ul class="ulsBox">
          <li>
            <span>导航ID</span>
            <span>{{objNav.resourceId}}</span>
            <span>导航名称</span>
            <span>{{objNav.name||'--'}}</span>
          </li>
          <li>
            <span>导航父ID</span>
            <span>{{objNav.resourcePid}}</span>
            <span>导航URL</span>
            <span>{{objNav.url}}</span>
          </li>
          <li>
            <span>排序</span>
            <span>{{objNav.sort||'--'}}</span>
            <span>导航图标</span>
            <span>{{objNav.icon||'--'}}</span>
          </li>
          <li>
            <span>页面参数</span>
            <span>{{objNav.pageParams||'--'}}</span>
            <span>导航类型</span>
            <span>{{objNav.resourceType||'--'}}</span>
          </li>
          <li>
            <span>子页面URL配置</span>
            <span>{{objNav.accidentCause||'--'}}</span>
            <span>页面ID(APP)</span>
            <span>{{objNav.appPageId||'--'}}</span>
          </li>
          <li>
            <span>是否可见</span>
            <span>{{objNav.blackoutTime|dateFormat}}</span>
            <span>是否可操作</span>
            <span>{{objNav.receiveClassElement||'--'}}</span>
          </li>
        </ul>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>
<script>
import apiClient from "@/publicJs/apiClient.js";
import commonBread from "@/components/common/commonBread";
import commonFooter from "@/components/common/commonFooter";
export default {
  name: "navInfo",
  data() {
    return {
      aryBread: [
          { name: "系统设置 ", url: "/systemHome" },
          { name: "导航管理", url: "/systemHome/navMng" },
          { name: "导航详情", url: ""}
      ],
      objNav:{}
    };
  },
  watch: {
  },
  components: {
    commonBread,
    commonFooter,
  },
  methods:{
    returnList(){
      this.$router.go(-1)
    },
    getNavInfo(){

    }
  },
  created() {
    var that = this;
    that.objNav = that.$route.params;
    
  },

  filters: {
    //时间格式化
    dateFormat: function(value) {
      if (
        value !== null &&
        value !== 0 &&
        value !== undefined &&
        value !== ""
      ) {
        return UtilService.formatDuring(value, "yyyy-MM-dd  HH:mm:ss");
      } else {
        return "--";
      }
    },
    dayFormat: function(value) {
      if (
        value !== null &&
        value !== 0 &&
        value !== undefined &&
        value !== ""
      ) {
        return UtilService.formatDuring(value, "yyyy-MM-dd");
      } else {
        return "--";
      }
    },
    timeFormat: function(value) {
      if (
        value !== null &&
        value !== 0 &&
        value !== undefined &&
        value !== ""
      ) {
        return UtilService.formatDuring(value, "HH:mm:ss");
      } else {
        return "--";
      }
    },
    hourFormat: function(value) {
      if (value == "" || value == undefined || value == 0) {
        return "--";
      } else {
        return (value - 0) / (60 * 1000) > 1
          ? Math.floor((value - 0) / (60 * 1000)) +
              "分钟" +
              Math.ceil(((value - 0) % (1000 * 60)) / 1000) +
              "秒"
          : Math.ceil(((value - 0) % (1000 * 60)) / 1000) + "秒";
      }
    }
  }
};
</script>
<style scoped>
i,
em,
strong,
b {
  font-style: normal;
  font-weight: normal;
}
.navInfo {
  width: 100%;
  height: 100%;
  position: relative;
  background: #efefef;
  padding: 10px 10px 0px 10px;
}
.infoContent {
  width: 100%;
  height: calc(100% - 90px);
  margin-top: 10px;
  background: #ffffff;
  border-radius: 5px;
  overflow: auto;
}
.topOperField {
  padding: 10px 0 0 10px;
}
.infoData {
  margin: 10px 10px;
  border: 1px solid #eeeeee;
  width: 50%;
  float: left;
  background: #fafafa;
  height: 642px;
}
.infoData > ul {
  width: 100%;
  line-height: 43px;
  color: #666;
}
.infoData > ul > li {
  background: #ffffff;
  display: flex;
  min-height: 42px;
}
.infoData > ul > li > span {
  display: inline-block;
  white-space: nowrap;
}

.infoData > ul > li > span:nth-child(1) {
  color: #333;
  width: 10%;
  text-align: center;
  border: 1px solid #e1e1e1;
  border-top: none;
  border-left: none;
  background: #f5f5f5;
}
.infoData > ul > li > span:nth-child(2) {
  width: 40%;
  text-align: left;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  padding-left: 8px;
  word-break: break-all;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infoData > ul > li > span:nth-child(3) {
  width: 10%;
  color: #333;
  text-align: center;
  border: 1px solid #e1e1e1;
  border-left: none;
  border-top: none;
  background: #f5f5f5;
}
.infoData > ul > li > span:nth-child(4) {
  width: 40%;
  text-align: left;
  border-bottom: 1px solid #e1e1e1;
  padding-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.headerSpan {
  display: block;
  font-size: 14px;
  padding: 10px 20px;
  color: #333333;
  border-bottom: #eeeeee solid 1px;
}
.ulsBox {
  float: left;
  border-right: 1px solid #cdcdcd;
  overflow: auto;
}
.ulsBox:last-child {
  border-right: none;
}
.ulsBox > li {
  background: #fafafa !important;
  font-size: 12px;
}
#spnJoin {
  border-bottom: 1px solid #eeeeee;
}
.icon-gongdan:before {
  color: #9e9e9e;
}
</style>