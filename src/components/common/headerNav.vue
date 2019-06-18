<template>
  <div class="headerNav" @mouseleave.stop="hideOper">
       <div class="navbar">
           <div class="navOper">
              <span v-if="item.id!=='b10002'" :key="item.id" v-for="(item) in homeNav">
                <span style="marginRight:0" class="operIcon iconfont"
                    :class="item.isShow==1?'operIcon '+item.icon:'greyIcon '+item.icon" 
                    :title="item.name"
                    @click="homeNavClick(item)">
                </span>
                <span class="contentStyle" style="font-size: 14px">{{item.name}}</span>
              </span>
               <!-- <span v-for="(item) in homeNav" class="operIcon iconfont"
                    v-if="item.id!=='b10002'" 
                    :key="item.id" 
                    :class="item.isShow==1?'operIcon '+item.icon:'greyIcon '+item.icon" 
                    :title="item.name"
                    @click="homeNavClick(item)"><span style="font-size: 14px">{{item.name}}</span>
                </span> -->
                <span v-else class="operIcon iconfont"
                    :class="item.isShow==1?'operIcon '+item.icon:'greyIcon '+item.icon" 
                    :title="item.name"
                    @click="homeNavClick(item)">
                    <sup class="red-badge" v-if="unReadNum==0?false:true">{{unReadNum}}</sup>
                </span>
               <span class="operIcon iconfont icon-gerenzhongxin" @click="showOperList=!showOperList">
<!--                   <span class="username">{{username}}</span>-->
                  <div class="personImg" >
                    <img src="../../assets/image/mainPage/dog.jpg" alt="" style="width: 100%;height: 100%">
                  </div>
                </span>
             <span class="operIcon iconfont icon-tuichu" @click="loginOut" style="color: lightgrey"></span>
           </div>
       </div>
        <div v-show="showOperList" class="oprList">
            <div class="perDown" @click="modefiyPassword">修改密码</div>
            <!-- <div class="perDown" @click="systemHome">设置</div> -->
            <div class="perDown" @click="loginOut">退出登录</div>
        </div>
  </div>
</template>
<script>
import apiClient from "@/publicJs/apiClient.js";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
import Constants from "@/publicJs/Constants.js";
import UtilService from "@/publicJs/UtilService";
import userService from "@/publicJs/userService.js";
  import eventBus from '@/publicJs/eventBus.js'

export default {
  name: "headerNav",
  props: {
    unReadNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      homeNav: [
        {
          id: "b10001",
          name: "主题",
          parent: "0",
          url: "/home/mainPage",
          icon: "icon-kujialeqiyezhan_tiaosepan",
          isShow: 1
        },
        {
          id: "b101_01",
          name: "公告",
          parent: "0",
          url: "/msgList",
          icon: "icon-lingdang1",
          isShow: 1
        },
      ],
      username: JSON.parse(localStorage.getItem("userInfo")).acountName,
      showOperList: false,
      showMsgBox: true,
      msgContent: "1111",
      msgTime: "",
      dialogVisible: false,
      noClose: false,
      msgObj: {
        sender: "消息发送者",
        topic: "消息主题",
        itemid: "001",
        currentStatus: "5"
      },
      objTask: {}
    };
  },
  mounted() {
    // this.clientSocket();
    this.getAuth();
  },
  methods: {
    homeNavClick: function(item) {
      if (item.isShow == 1) {
        this.$router.push(item.url);
      }
    },
    loginOut: function() {
      var that = this;
      //记录登录次数.
      var param = {logoutTime:new Date().getTime(),id:localStorage.getItem('logInId')}
      apiClient.post('ssiteapi/platform/homepage/api/updateLoginRecord',param,function(pres){
          if(pres.status == 200){
            userService.clearUser();
            eventBus.$emit('closeSocket')
            that.$router.push("/");
          }
      })
      
    },
    systemHome: function() {
        this.$router.push("/systemHome")
    },
    modefiyPassword:function(){
         this.$router.push("/systemHome/modefiyPassword")
    },
    getTaskInfoById: function(id) {
      var that = this;
      apiClient.get(
        "ssiteapi/platform/activity/api/item/res?itemid=" + id,
        {},
        function(pres) {
          if (pres.status == "200") {
            that.objTask = pres.results;
          }
        }
      );
    },
    getAuth: function() {
      var that = this;
      var aryAuth = userService.getAuths();
      $.each(that.homeNav, function(i) {
        $.each(aryAuth, function(j) {
          if (that.homeNav[i].id == aryAuth[j].resourceId) {
            if ($.inArray("0", aryAuth[j].operations) > -1) {
              that.homeNav[i].isShow = 1;
            } else {
              that.homeNav[i].isShow = 0;
            }
          }
        });
      });
    },
    hideOper: function() {
      this.showOperList = false;
    },
    toHome: function() {
      var currenrRoute = this.$route.name;
      if (currenrRoute == "home") {
        this.$router.go(0);
      } else {
        this.$router.push("");
      }
    }
  },
  filters: {
    //时间格式化
    dateFormat: function(value) {
      if (value !== "" && value !== 0) {
        return UtilService.formatDuring(value, "yyyy-MM-dd  HH:mm:ss");
      } else {
        return "-";
      }
    }
  }
};
</script>
<style scoped>
.headerNav {
  height: 60px;
  z-index: 1;
  width: 100%;
}
.navbar {
  height: 60px;
  background: #fff;
  box-shadow: 0px 0px 12px 1px rgba(118, 165, 237, 0.08);
}
.logoImg {
  width: 25px;
  height: 22px;
  background: url("../../assets/image/logoImg.png");
  background-size: 100% 100%;
  left: 40px;
  top: 19px;
  position: absolute;
  cursor: pointer;
}
.logoName {
  height: 60px;
  line-height: 60px;
  background-size: 100% 100%;
  left: 74px;
  font-size: 18px;
  color: #ffffff;
  position: absolute;
  cursor: pointer;
}
.navOper {
  float: right;
  color: #ffffff;
}
.navOper .operIcon {
  margin-right: 35px;
  font-size: 20px;
  line-height: 60px;
  cursor: pointer;
  display: inline-block;
  height: 60px;
  float: left;
  color:#08979C;
  position: relative;
}

.navOper .greyIcon {
  margin-right: 35px;
  font-size: 20px;
  line-height: 60px;
  /* color: #fff; */
  cursor: text;
  position: relative;
  opacity: 0.4;
}
.personImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.personImg img{
  border-radius: 50%;
}
.username {
  font-size: 16px;
  line-height: 60px;
  margin: 0px 5px 0px 15px;
}
.oprList {
  position: absolute;
  right: 40px;
  top: 60px;
  width: 100px;
  height: 80px;
  background: #ffffff;
  box-shadow: -2px 2px 9px 0px rgba(2, 2, 2, 0.15);
  border-radius: 3px;
  z-index: 10;
}
.perDown {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: #828282;
  padding-left: 20px;
}
.perDown:hover {
  background: #eaf1fb;
    color: #1081fa;
}
.msgBox {
  width: 400px;
  height: 200px;
  background: #ffffff;
  position: fixed;
  right: 10px;
  bottom: 10px;
  border-radius: 3px 3px 0px 0px;
  box-shadow: 0px 3px 9px 0px rgba(5, 4, 4, 0.15);
  z-index: 10;
}
.boxHeader {
  width: 100%;
  height: 40px;
  background: #1081fa;
  color: #ffffff;
  line-height: 40px;
  padding: 0px 10px;
}
.boxContent {
  padding: 15px 40px;
  line-height: 40px;
}
.breakContent > ul {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #666;
}
.breakContent > ul > li > span {
  display: inline-block;
  float: left;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.breakContent > ul > li > span:nth-child(1) {
  width: 15%;
  text-align: center;
}
.breakContent > ul > li > span:nth-child(2) {
  width: 27%;
  text-align: left;
}
.breakContent > ul > li > span:nth-child(3) {
  width: 15%;
  text-align: center;
}
.breakContent > ul > li > span:nth-child(4) {
  width: 40%;
  text-align: left;
}
.seeInfo {
  color: #1081fa;
  display: inline-block;
  position: absolute;
  bottom: 4px;
  right: 24px;
  cursor: pointer;
}
.badgeBox {
  line-height: 25px !important;
  margin-top: 19px;
}
.badgeBox .iconfont {
  font-size: 20px;
}

.red-badge {
  left: 10px;
  position: absolute;
  top: 8px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
}
.contentStyle {
  display: block;
    font-size: 14px;
    float: left;
    line-height: 58px;
    height: 60px;
    margin-right: 35px;
    text-align: center;
    color: #08979C;
    cursor: pointer;
}
</style>
