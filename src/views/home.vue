<template>
  <div class="home">
    <div class="left" v-show="!showFullScreen">
      <div class="iconImg" @click="goHome">
        <div class="iconLeft">
          <img src="../assets/image/mainPage/logo(3).png" alt="">
        </div>
        <div :class="['iconRight', imgRightFlag?'':'imgRightFlag']">
          <img src="../assets/image/mainPage/logo(4).png" alt="">
        </div>
      </div>







      <el-menu
        class="el-menu-vertical-demo"
        ref="elMenuVerticalDemo"
        @select="selectLeft"
        :collapse="isCollapse"
        :unique-opened="true"
      >
        <div class="person" style="display: none" :class="{newPerson:isShowPerson===false}">
          <div class="personImg" :class="{newPersonP:isShowPerson===false}">
            <img src="../assets/image/mainPage/dog.jpg" alt="" style="width: 100%;height: 100%">
          </div>
          <span class="personName" v-show="isShowPerson">{{username}}</span>
          <div class="icont" v-show="isShowPerson">
            <i class=" left iconfont icon-icon_set_up "></i>
            <i class="iconfont icon-tuichu1 "></i>
          </div>
        </div>
        <el-submenu :index="v.url" v-if="v.children&&v.children.length>0" v-for="(v,i) in modalList " :key="i">
          <template slot="title">
            <i :class="v.icon+' iconfont'"></i>
            <span slot="title">{{v.name}}</span>
          </template>
          <el-menu-item-group v-for="(val,ind) in v.children" :key="ind">
            <el-submenu :index="val.url" v-if="val.children&&val.children.length>0">
              <span slot="title">{{val.name}}</span>
              <el-menu-item
                v-for="(value,index) in val.children"
                :class="[value.isShow==1?'':'greyNav ',value.id==selectedNav?'is-actived':'',value.id]"
                :disabled="value.isShow==0?true:false"
                :index="value.url"
                :key="index"
              >{{value.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              :disabled="val.isShow==0?true:false"
              :class="[val.isShow==1?'':'greyNav ',val.id==selectedNav?'is-actived':'',val.id]"
              :index="val.url" v-else>
              {{val.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          :index="v.url"
          :class="[v.isShow==1?'':'greyNav ',v.id==selectedNav?'is-actived':'',v.id,]"
          :disabled="v.isShow==0?true:false" v-else-if='!v.children&&v.id!=111' >
          <i :class="v.icon+' iconfont'"></i>
          <span slot="title">{{v.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <span class="changeColor"
        :class="isCollapse?'iconfont changeLeftNav icon--':'iconfont changeLeftNav icon--'"
        @click="changeLeft"
      ></span>
      <header-nav :unReadNum="unReadNum" v-show="!showFullScreen"></header-nav>
      <common-msg @unReadChange="unReadChange"></common-msg>
      <div class="router">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import apiClient from "@/publicJs/apiClient.js";
  import headerNav from "@/components/common/headerNav.vue";
  import commonMsg from "@/components/common/commonMsg";
  import userService from "@/publicJs/userService.js";
  import $ from "jquery";
  export default {
    name: "home",
    data() {


      return {
        isShowPerson:true,
        isCollapse: false,
        imgRightFlag:true,
        unReadNum: 0,
        authAry:[],
        newAuthAry:[],
        modalList:[],
        showFullScreen:false,
        selectedNav:'',
        navUrl:'',
        username: JSON.parse(localStorage.getItem("userInfo")).acountName,
      };
    },
    components: {
      headerNav,
      commonMsg
    },
    created() {
      var that = this;
      //获取所有权限信息
      that.authAry = userService.getAuths();
      //获取导航列表
      that.getNavList();
      that.getAuthAry(that.modalList);
    },
    mounted(){
      var that = this;
      // 监听路由变化
      that.$router.beforeEach((to, from, next) => {
        that.selectNavByNow(to.name);
        next();
      });
      that.selectNavByNow(that.$route.name);
    },
    methods: {
      selectNavByNow:function(name){
        var that = this;
        var ary = that.modalList;
        var strId = '';
        $.each(ary,function(i){
          if(ary[i].children&&ary[i].children.length>0){
            var array = ary[i].children;
            $.each(array,function(j){
              if(array[j].listName){
                if($.inArray(name,array[j].listName)>-1){
                  strId = array[j].id;
                  if(that.$refs['elMenuVerticalDemo']){
                    that.$refs['elMenuVerticalDemo'].open(ary[i].url);
                    that.navUrl = ary[i].url;
                  }

                }
              }else{
                var cAry = array[j].children;
                $.each(cAry,function(k){
                  if(cAry[k].listName){
                    if($.inArray(name,cAry[k].listName)>-1){
                      strId = cAry[k].id;
                      if(that.$refs['elMenuVerticalDemo']){
                        that.$refs['elMenuVerticalDemo'].open(array[j].url);
                        that.navUrl = array[j].url;
                      }
                    }
                  }
                })
              }
            })

          }
        })
        that.selectedNav = strId;
      },
      getNavList(){
        var that = this;
        //先清空导航列表
        that.modalList = [];
        var navList = require("@/assets/json/leftNav.json");
        var userObj = JSON.parse(localStorage.getItem("userInfo"));
        if (userObj.acountName == "sysadmin") {
          that.modalList = JSON.parse(JSON.stringify(navList));
          that.modalList.forEach(function(item,ind){
            if(item.name == '管理中心'){
              that.modalList[ind].children.push(
                {
                  id: "b103_14",
                  name: "版本管理",
                  url: "/systemHome/versionUpload/versionUpload",
                  icon: "icon-banben",
                  isShow: 1,
                  listName: ["versionUpload"]
                },
                {
                  id: "b103_15",
                  name: "资产纠偏",
                  url: "/systemHome/assetsMapRecover",
                  icon: "icon-wuliaoguanli",
                  isShow: 1,
                  listName: ["assetsMapRecover"]
                }

              );
            }
          })

        }else {
          that.modalList = JSON.parse(JSON.stringify(navList));
        }
      },
      changeLeft() {
        this.isShowPerson =  !this.isShowPerson
        this.isCollapse = !this.isCollapse;
        // setTimeout(()=>{
        this.imgRightFlag = !this.imgRightFlag
        // },155)
      },
      unReadChange: function(num) {
        this.unReadNum = num;
      },
      selectLeft(key, keyPath) {
        this.$router.push(key);
      },
      getAuthAry(Ary){
        var that = this;

        var newAry = Ary;
        newAry.forEach(function(item,ind){
          if(item.children){
            that.getAuthAry(item.children)
          }else {
            $.each(that.authAry, function(j) {
              if (newAry[ind].id == that.authAry[j].resourceId) {
                if ($.inArray("0", that.authAry[j].operations) > -1) {
                  newAry[ind].isShow = 1;
                } else {
                  newAry[ind].isShow = 0;
                }
              }
            });
          }
        })
        that.newAuthAry = that.newAuthAry.concat(newAry);
        // return newAry;
      },
      goHome(){
        var that = this;
        that.$router.push('/home/mainPage');
        that.$refs['elMenuVerticalDemo'].close(that.navUrl)
      },
      // getAuth: function() {
      //   var that = this;
      //   that.newAuthAry = [];
      //   //找到所有有权限的项
      //   that.getAuthAry(that.modalList);
      //   var nowRouter = that.$route.path;
      //   var haveAuth = false;
      //   $.each(that.modalList, function(i) {
      //     if (that.modalList[i].url == nowRouter) {
      //       haveAuth = that.modalList[i].isShow == 0 ? false : true;
      //     }
      //   });
      //   if (!haveAuth) {
      //     var path = "";
      //     $.each(that.modalList, function(i) {
      //       if (that.modalList[i].children&&that.modalList[i].children.length>0) {
      //         var isHave = false;
      //         $.each(that.modalList[i].children, function(j) {
      //           if (that.modalList[i].children[j].isShow == 1) {
      //             path = that.modalList[i].children[j].url;
      //             isHave = true;
      //             return false;
      //           }
      //         });
      //         if (isHave) {
      //           return false;
      //         }
      //       } else {
      //         if (that.modalList[i].isShow == 1) {
      //           path = that.modalList[i].url;
      //           return false;
      //         }
      //       }
      //     });
      //       that.$router.push(path);
      //   }
      // }
    }
  };
</script>
<style scoped lang='scss'>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}












.el-menu{
  // background:linear-gradient(223deg,#086BD4 0%,rgba(74,155,234,1) 100%);
  background: #08979C;
}
.person{
  width: 100%;
  height: 180px;
  background: #08979C;
  position: relative;
}
.newPerson{
  width: 100%;
  height: 100px;
  background: #08979C;
  position: relative;
}
.personImg{
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translate(-50%,0%);
  width: 70px;
  height: 77px;
  background: #08979C;
  border-radius: 50%;
}
.personImg img{
  border-radius: 50%;
}
.newPersonP{
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translate(-50%,0%);
  width: 45px;
  height: 50px;
  background: #08979C;
  border-radius: 50%;
}

.personName{
  text-align: center;
  position: absolute;
  top: 95px;
  width: 100%;
  font-size: 20px;

}
.icont{
  position: absolute;
  top: 135px;
  height: 20px;
  width: 100%;
  background: #08979C;
  text-align: center;
}
.icont i{
  color: #fff;
}
.icont .left{
  padding-right: 20px;

}
.el-menu-vertical-demo>.el-menu-item{
  height: 50px!important;
  line-height: 50px!important;
}
.el-menu-vertical-demo .iconfont{
  font-size: 14px!important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100% - 70px);
  overflow-y: auto;
}
.el-menu--collapse {
  height: calc(100% - 70px);
  overflow-y: auto;
}
.right {
  height: 100%;
  overflow-y: scroll;
  width: calc(100% - 65px);
  display: flex;
  flex-direction: column;
  position: relative;
}
.left {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.right .router {
  flex: 1;
  overflow-y: auto;
  background: #efefef;
}
.iconImg {
  height: 70px;
  overflow: hidden;
  background: #08979C;
  display: flex;
  justify-content: center;
  align-items: center;
  padding:  10px;
  cursor: pointer;
  //background:rgba(8,107,211,1);
  // box-shadow:0px 1px 1px 0px rgba(0,0,0,0.19);
  border-bottom: 1px solid rgba(0,0,0,0.19);
}
.iconImg img {
  width: 90%;
  height: 80%;
}
.iconLeft{
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 90%;
    // height: 20%!important;
  }
}
.iconRight{
  display: flex;
  justify-content: left;
  align-items: center;
}
.imgRightFlag{
  display: none;
  transition: display 1s 1s;
}
.changeLeftNav {
  position: absolute;
  cursor: pointer;
  left: 0;
  top: 0;
  z-index: 400;
  color: #999;
  font-size: 20px;
  line-height: 60px;
  margin-left: 15px;
}
.iconRight {
  width: 110px;
  height: 37px;
  margin-left: 10px;
}
.changeColor:hover{
  color: #02848D;
}
</style>
