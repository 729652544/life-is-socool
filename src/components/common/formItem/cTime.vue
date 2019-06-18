<template>
    <div class="cTime">
        <!-- <el-date-picker v-model="troubleForm.informTime" :clearable="false" type="datetime" prefix-icon="el-icon-date" placeholder="选择报修日期"></el-date-picker> -->
        <el-date-picker 
            v-model="time" 
            :clearable="false"  
            type="datetime" 
            prefix-icon="el-icon-date" 
            placeholder="请选择时间"
            @click="dateClick"></el-date-picker>
    </div>
</template>
<script>
import Vue from 'vue' 
export default {
    name:'cTime',
    props:{
        itemData:{
            type:Object,
            default:function(){
                return {
                    name: "属性名称",
				    type: "属性类型",
				    IsRequired: 0,
				    value:0,
                }
            },
        }
    },
    watch:{
        time:function(newVal,oldVal){
            this.itemData.value = newVal.getTime();
        },
    },
    computed:{

    },
    data(){
      return {
        time:this.itemData.value==null||this.itemData.value==0?new Date():new Date(this.itemData.value),
      };
    },
    components: {

    },
    created(){
        if(this.itemData.value==null){
            this.itemData.value = new Date().getTime();
        }
    },
    methods:{
       dateClick:function(){
       }
    }   
}
</script>
<style scoped>
</style>