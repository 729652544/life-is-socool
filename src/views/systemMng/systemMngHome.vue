<template>
    <div class="system">
       <common-left
            navTitle='系统管理'
            :aryLeftNav="navList"
            @refresh="refresh"
            @navChange="navChange"></common-left>                
      <div class="systemRight" ref="rightContent">        
         <router-view></router-view>  
      </div>     
    </div>
</template>
<script>
import commonLeft from "@/components/common/commonLeft";
import apiClient from "@/publicJs/apiClient.js";
import userService from "@/publicJs/userService.js";

export default {
  data() {
    var a = JSON.parse(localStorage.getItem('userInfo'));
    this.navList = [
      {
          id: "1",
          name: "权限管理",
          url: "",
          icon: "el-icon-location",
          isShow: 0,
          children: [
            {
              id: "b103_01",
              name: "组织架构",
              url: "/systemHome",
              isShow: 0,
              listName: ["orgStructure"]
            },
            {
              id: "b103_03",
              name: "角色管理",
              url: "/systemHome/roleManagement",
              isShow: 0,
              listName: ["roleManagement"]
            },
            {
              id: "b103_02",
              name: "用户管理",
              url: "/systemHome/userManagement",
              isShow: 0,
              listName: ["userManagement"]
            },
            
          ]
        },
        {
          id: "2",
          name: "个人管理",
          url: "/systemHome/perInfo",
          icon: "icon-jilu",
          isShow: 1,
          children: [
            {
              id: "2-1",
              name: "基本信息",
              url: "/systemHome/perInfo",
              isShow: 1,
              listName: ["perInfo"]
            },
            {
              id: "2-2",
              name: "修改密码",
              url: "/systemHome/modefiyPassword",
              listName: ["modefiyPassword"],
              isShow: 1
            }
          ]
        },
        {
          id: "3",
          name: "文档管理",
          url: "",
          icon: "el-icon-tickets",
          isShow: 0,
          children: [
            {
              id: "b103_12_01",
              name: "文档树",
              url: "/systemHome/documentTreeManager",
              isShow: 0,
              listName: ["documentTreeManager"]
            },
            {
              id: "b103_12_02",
              name: "文档标签",
              url: "/systemHome/documentLabelManager",
              isShow: 0,
              listName: ["documentLabelManager"]
            }
            
          ]
        },
        {
          id: "b103_06",
          name: "字典管理",
          url: "/systemHome/dictionaryMng",
          icon: "icon-changguizidian",
          isShow: 0,
          listName: ["dictionaryMng"]
        },
        {
          id: "b103_04",
          name: "模型管理",
          url: "/systemHome/modelMng/res",
          icon: "icon-moxing",
          isShow: 0,
          listName: ["modelMng", "modelAttr", "modelInfo","attrInfo"]
        },
        {
          id: "b103_05",
          name: "维度管理",
          url: "/systemHome/dimensionMng",
          icon: "icon-duoweiduziyoupouxi",
          isShow: 0,
          listName: ["dimensionMng"]
        },
        {
          id: "b103_07",
          name: "资源管理",
          url: "/systemHome/resourceMng/model/1",
          icon: "icon-msnui-report",
          isShow: 0,
          listName: ["resourceMng", "resourceInfo","resourceText"]
        },{
          id: "b103_08",
          name: "套件管理",
          url: "/systemHome/materialSuiteMng/materialSuiteInfo",
          icon: "icon-wuliaoguanli",
          isShow: 0,
          listName: ["materialSuiteInfo",'materialEdit']
        },
    ];
    if(a.acountName == 'sysadmin') {
      this.navList.push(
        {
          id: "b103_09",
          name: "版本管理",
          url: "/systemHome/versionUpload/versionUpload",
          icon: "icon-banben",
          isShow: 1,
          listName: ["versionUpload"]
        }
        ,{
          id: "b103_10",
          name: "资产纠偏",
          url: "/systemHome/assetsMapRecover",
          icon: "icon-wuliaoguanli",
          isShow: 1,
          listName: ["assetsMapRecover"]
        },
        
      )
    }
    return {
    };
  },
  components: {
    commonLeft
  },
  mounted() {
    this.getAuth();
    
  },
  methods: {
    refresh: function(url) {
      this.$router.push(url);
    },
    navChange: function(status) {
      var a = document.getElementsByClassName('commonLeft')[0]
      if (status == "close") {
        this.$refs.rightContent.style.width = "100%";
        a.style.width = '18px'
        this.$refs.rightContent.style.marginLeft = "0%";
      } else if (status == "open") {
        this.$refs.rightContent.style.width = "90%";
        a.style.width = '10%'
        this.$refs.rightContent.style.marginLeft = "10%";
      }
    },
    getAuth:function(){
        var that = this;
        var aryAuth = userService.getAuths();
        $.each(that.navList,function(i){
          if(that.navList[i].children){
            $.each(that.navList[i].children,function(k){
              $.each(aryAuth,function(j){
                  if(that.navList[i].children[k].id==aryAuth[j].resourceId){
                      if($.inArray('0',aryAuth[j].operations)>-1){
                          that.navList[i].children[k].isShow = 1;
                      }else{
                          that.navList[i].children[k].isShow = 0;
                      }
                  }
              })
            })
          }else {
            $.each(aryAuth,function(j){
                if(that.navList[i].id==aryAuth[j].resourceId){
                    if($.inArray('0',aryAuth[j].operations)>-1){
                        that.navList[i].isShow = 1;
                    }else{
                        that.navList[i].isShow = 0;
                    }
                }
            })
          }
        });
        var nowRouter = that.$route.path;
        var haveAuth = false;
        $.each(that.navList,function(i){
          if(that.navList[i].url == nowRouter){
              haveAuth = that.navList[i].isShow ==0?false:true;
          }
        })
        if(!haveAuth){
            var path = '';
            $.each(that.navList,function(i){
              if(that.navList[i].children){
                var isHave = false;
                $.each(that.navList[i].children,function(j){
                  if(that.navList[i].children[j].isShow == 1){
                    path = that.navList[i].children[j].url
                    isHave = true;
                    return false;
                  }
                })
                if(isHave){
                  return false;
                }
              }else {
                if(that.navList[i].isShow == 1){
                    path = that.navList[i].url;
                    return false;
                }
              }
            })
            if(path==''){
                that.$router.push('/home');
            }else{
              that.$router.push(path);
            }
        }
    },
  }
};
</script>
<style>
.system {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #ececec;
}
.systemRight {
  width: 90%;
  height: 100%;
  margin-left: 10%;
}
</style>
