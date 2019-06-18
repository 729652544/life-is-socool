<template>
    <div class="cTextArea">
        <el-input type="textarea" v-model="itemData.value" :rows="3" :placeholder="'请输入'+itemData.name"></el-input>
    </div>
</template>
<script>
import Vue from 'vue' 
export default {
    name:'cTextArea',
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