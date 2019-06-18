<template>
  <div class="commonLeft" ref="leftNav">
    <div v-show="nowStatus=='open'" class="scheduleNav">
        <div class="title"> 
          {{navTitle}}
        </div>
         <el-menu
            ref="leftMenu"
            class="left-menu"
            :unique-opened="true">
            <span  
                v-for="(item) in aryLeftNav" 
               :key="item.id" >
                <el-menu-item 
                    v-if="item.children==undefined||item.children.length==0"
                    :index="item.id"
                    :class="[item.isShow==1?'':'greyNav ',item.id==selectedNav?'is-actived':'',item.id,'blod']"
                     @click="clickNavList(item)">
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
                <el-submenu v-else :index="item.id">
                  <template slot="title">
                    <div class="blod">
                      <i class="iconfont" :class="item.icon"></i>
                      <span slot="title" class="secondNav">{{item.name}}</span>
                    </div>
                  </template>
                  <el-menu-item
                    v-for="per in item.children"
                    :key="per.id"
                    :index="per.id"
                    :class="[per.isShow==1?'':'greyNav ',per.id==selectedNav?'is-actived':'',per.id,]"
                    @click="clickNavList(per)">
                     <i class="iconfont"></i>
                    <span slot="title">{{per.name}}</span>
                  </el-menu-item>
                </el-submenu>
            </span>
         </el-menu>
         <div class="operField" @click="closeNav">
          <span class="iconfont icon-fanhui"></span>
        </div>
    </div>
    <div v-show="nowStatus=='close'" @click="openNav" class="openNavBtn">
      <span class="iconfont icon-right1"></span>
    </div>
  </div>
</template>
<script>
import apiClient from '@/publicJs/apiClient.js'
export default {
  name:'commonLeft',
  props:{
    aryLeftNav:{
       type:Array,
         default:function(){
             return [];
         },
    },
    navTitle:{
      type:String,
      default:'',
    }
  },
  data(){
      return{
        nowStatus:'open',
        selectedNav:'',
      }
  },
  mounted() {
    var that = this;
      // 监听路由变化
    that.$router.beforeEach((to, from, next) => {
        that.selectNavByNow(to.name);
        next();
     });
     that.selectNavByNow(that.$route.name);
  },
  methods:{
    getLeftNav:function(){
      var aryNav  = JSON.parse(localStorage.getItem('apiList')) ;
      var aryLeftNav = [];
      $.each(aryNav,function(i){
          if(aryNav[i].parent=='b10001_001'){
              aryLeftNav.push(aryNav[i]);
          }
      })
      this.aryLeftNav = aryLeftNav;
    },
    // 点击左侧导航
    clickNavList:function(item){
      if(item.isShow==1){
        var currenrRoute = this.$route.path;
        if(item.url){
            if(currenrRoute==item.url){
              this.$router.go(0);
            }else{
              this.$emit('refresh',item.url);
            }
        }
        
      }
    },
    closeNav:function(){
      this.nowStatus = "close";
      // this.$refs.leftNav.style.width='0%';
      this.$emit('navChange','close');
    },
    openNav:function(){
      this.nowStatus = 'open';
      this.$emit('navChange','open');
    },
    selectNavByNow:function(name){
      var that = this;
      var ary = that.aryLeftNav;
      var strId = '';
      $.each(ary,function(i){
        if(ary[i].listName){
            if($.inArray(name,ary[i].listName)>-1){
               strId = ary[i].id;
             }
        }else{
            var cAry = ary[i].children;
            $.each(cAry,function(j){
               if(cAry[j].listName){
                    if($.inArray(name,cAry[j].listName)>-1){
                      strId = cAry[j].id; 
                      if(that.$refs['leftMenu']){
                         that.$refs['leftMenu'].open(ary[i].id);
                      }
                    }
                }
            })
        }
      })
      that.selectedNav = strId;
    },
  }
}
</script>
<style scoped>
  .commonLeft{
    width: 10%;
    height: 100%;
    position: absolute;
    left: 0px;
    z-index: 99;
    overflow: auto;
  }
  .scheduleNav{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
  .scheduleNav .title{
    padding-left: 18.3%;
    height: 55px;
    line-height: 65px;
    font-size: 16px;
    border-bottom: 2px solid #ffffff;
    color: #333333;
  }
  .operField{
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 50%;
    cursor: pointer;
    margin-top: -15px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }
  .operField:hover{
    color: #1081fa;
  }
  .operField .iconfont{
    font-size:19px;
  }
  .openNavBtn{
    width: 18px;
    height: 98px;
    background: #1081fa;
    border-radius: 0px 5px 5px 0px;
    color: #ffffff;
    cursor: pointer;
    position: absolute;
    text-align: center;
    z-index: 100;
    top: 50%;
    margin-top: -48px;
  }
  .openNavBtn .iconfont{
    font-size: 19px;
    line-height: 98px;
    height: 98px;
  }
  .blod{
    color:#333!important;
  }
  .secondNav {
    padding-left: 4px;
  }
</style>
<style>
  .left-menu.el-menu{
    border-right:none!important;
  }

  .left-menu .el-menu-item{
    transition: all 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0 11%;
    height: 40px;
    line-height: 38px;
    color: #666;
    font-size: 14px;
    text-align: center;
    list-style: none;
    cursor: pointer;
  }
  .left-menu .el-menu-item:hover{
    background: #eaf1fb;
    color: #1081fa!important;
    transition: all 0;
  }
  .el-menu-item.is-active{
    color:#fff!important;
  }
  .left-menu .el-menu-item.is-actived{
    background: none;
    color: #1081fa!important;
  }
   .left-menu .el-menu-item.is-actived .iconfont{
      color: #1081fa!important;
   }
  .left-menu .el-menu-item .iconfont{
    padding-right: 5px;
    display: inline-block;
    width: 21px;
  }
  .left-menu .el-menu-item:hover .iconfont{
    color: #1081fa!important;
  }
  .left-menu .el-submenu__icon-arrow{
    display: none;
  }
  .left-menu .el-submenu .el-menu-item{
    padding: 0px!important;
    text-align:center!important;
    height: 40px!important;
    line-height:38px!important;
  }
  .left-menu .greyNav{
    color: #cdcccc!important;
    cursor: text;
  }
  .left-menu .greyNav:hover{
    background: #ffffff;
    color: #cdcccc!important;
    transition: all 0;
  }
  .left-menu .greyNav.is-actived{
    background: #ffffff;
    color: #cdcccc!important;
    transition: all 0;
  }
  .left-menu .greyNav:hover .iconfont{
    color: #cdcccc!important;
  }
  .left-menu .greyNav  .iconfont{
    color: #cdcccc;
  }
</style>
