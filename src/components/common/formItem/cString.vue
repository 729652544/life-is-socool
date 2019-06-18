<template>
    <div class="cString">
        <el-input type="text" v-model="itemData.value" :placeholder="'请输入'+itemData.name" :disabled="cDisable"></el-input>
    </div>
</template>
<script>
import Vue from 'vue' 
export default {
    name:'cString',
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
        },
        cDisable:{
            type:Boolean,
            default:false,
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