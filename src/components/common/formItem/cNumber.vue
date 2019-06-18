<template>
    <div class="cNumber">
         <!-- <el-input-number v-model="itemData.value" controls-position="right" :min="1" :max="100000000000000"></el-input-number> -->
         <el-input type="text" v-model="itemData.value" :placeholder="'请输入'+itemData.name"></el-input>
    </div>
</template>
<script>
import Vue from 'vue' 
export default {
    name:'cNumber',
    props:{
        itemData:{
            type:Object,
            default:function(){
                return {
                    name: "属性名称",
				    type: "属性类型",
				    IsRequired: 0,
				    value:''
                }
            },
        }
    },
    watch:{
    },
    data(){
      return {
        
      };
    },
    components: {

    },
    created(){
        
    },
    methods:{
       
    }   
}
</script>
<style scoped>
</style>