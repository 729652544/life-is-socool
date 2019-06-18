<template>
  <div id="app">
    <div v-bind:class="{contentTop:headerShow}" class="content">
       <router-view/>
    </div>
  </div>
</template>
<script>
import apiClient from '@/publicJs/apiClient.js'

export default {
  name: "App",
  data() {
    return {
      headerShow: false,
      objUser:{},
    };
  },
  components: {
  },
  created() {
    // 根据路由状态  看是否显示头部导航栏
    var that = this;
    var homePage = that.$route.name;
    if(homePage!="login"&&homePage!='runTrend')
      that.headerShow=true;
    else {
      that.headerShow=false;
    }
    // 监听路由变化
    that.$router.beforeEach((to, from, next) => {
       if(to.name!="login"&&to.name!='runTrend')
         that.headerShow=true;
       else {
         that.headerShow=false;
       }
       next();
     });
  },
  mounted() {
  
    this.getUserInfo();

  },
  methods:{
    getUserInfo:function(){
      // 查看当前登录信息  若没登录  返回登录页
      this.objUser =  JSON.parse(localStorage.getItem('userInfo'));
      if(this.objUser){

      }else{
        this.$router.push('/');
      }
    },
  }

};
</script>
<style src="./css/public.css"></style>
<style src="./css/iconfont/iconfont.css"></style>



