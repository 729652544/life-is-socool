<template>
    <div class="breadField">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item 
                v-for="item in aryBread"
                :key="item.name"
                :to="{ path: item.url==''?item.url:'' }"
            >
                <span v-if="item.url==''">{{item.name}}</span>
                 <span v-else><a @click=refresh(item.url)>{{item.name}}</a></span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
  name:'breadField',
  props:{
    aryBread:{
        type:Array,
        default:function(){
            return [];
        },
    }
  },
  data(){
    return{
        currentViewId:'b10001_001_002',
    }
  },
  components: {

  },
  mounted() {
    
  },
  methods:{
    refresh:function(url){
        if(url.indexOf('maintain')>-1||url.indexOf('scheduleRecord')>-1||url.indexOf('defectList')>-1||url.indexOf('periodicPlan')>-1||url.indexOf('tasksPerformed')>-1){
            url+='/1'
        }
        this.$router.push(url);
    }
  }
}
</script>
<style scoped>
    .breadField{
        width: 100%;
        height: 40px;
        background: #ffffff;
        border-radius: 2px;
        padding-left: 10px;
        box-shadow: 0px 0px 9px 0px 
		rgba(16, 129, 250, 0.1);
    }
    .breadField .el-breadcrumb{
        line-height: 40px;
      
    }
</style>